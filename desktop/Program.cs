using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
namespace EnteraQuiz;
internal static class Program {
 [STAThread] static void Main() { ApplicationConfiguration.Initialize(); Application.Run(new QuizWindow()); }
}
public sealed class QuizWindow : Form {
 readonly WebView2 browser = new() { Dock = DockStyle.Fill };
 public QuizWindow() {
  Text = "Entera Quiz"; BackColor = System.Drawing.Color.FromArgb(5,18,39);
  FormBorderStyle = FormBorderStyle.None; WindowState = FormWindowState.Maximized;
  Controls.Add(browser); Load += async (_,_) => await InitializeBrowser();
 }
 async Task InitializeBrowser() {
  try {
   var webRoot = Path.Combine(AppContext.BaseDirectory,"wwwroot");
   if (!File.Exists(Path.Combine(webRoot,"index.html"))) {
    MessageBox.Show("Não foi encontrado o arquivo wwwroot\\index.html. Copie a pasta completa da publicação, incluindo wwwroot, junto do executável.","Arquivos do quiz ausentes");
    Close();
    return;
   }
   var fixedRuntime = Path.Combine(AppContext.BaseDirectory,"WebView2Runtime");
   var environment = await CoreWebView2Environment.CreateAsync(Directory.Exists(fixedRuntime)?fixedRuntime:null,Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"EnteraQuiz","WebView2"));
   await browser.EnsureCoreWebView2Async(environment);
   browser.CoreWebView2.SetVirtualHostNameToFolderMapping("quiz.entera.local",webRoot,CoreWebView2HostResourceAccessKind.DenyCors);
   browser.CoreWebView2.Settings.AreDevToolsEnabled = false;
   browser.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
   browser.CoreWebView2.Settings.IsZoomControlEnabled = false;
   browser.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;
   browser.CoreWebView2.NavigationStarting += (_,e) => { if(!e.Uri.StartsWith("https://quiz.entera.local/",StringComparison.OrdinalIgnoreCase)) e.Cancel=true; };
   browser.CoreWebView2.NewWindowRequested += (_,e) => e.Handled=true;
   browser.CoreWebView2.WebMessageReceived += (_,e) => {
    if (e.Source == "https://quiz.entera.local/index.html" && e.WebMessageAsJson == "\"close-app\"") Close();
   };
   browser.Source = new Uri("https://quiz.entera.local/index.html");
  } catch(Exception ex) { MessageBox.Show("Não foi possível iniciar o quiz. Verifique o runtime WebView2.\n\n"+ex.Message,"Entera Quiz"); Close(); }
 }
}
