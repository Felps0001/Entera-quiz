export const states = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
export function validateRegistration(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Dados inválidos.' };
  const text = key => typeof body[key] === 'string' ? body[key].trim().replace(/\s+/g, ' ') : '';
  const data = { nome: text('nome'), crm: text('crm'), celular: text('celular').replace(/[ ()-]/g, ''), estado: text('estado').toUpperCase(), especialidade: text('especialidade') };
  if (data.nome.length < 3 || data.nome.length > 120) return { error: 'Informe seu nome completo (3 a 120 caracteres).' };
  if (!/^\d{1,8}$/.test(data.crm) || Number(data.crm) === 0) return { error: 'Informe um número de CRM válido.' };
  data.crm = String(Number(data.crm));
  if (!states.has(data.estado)) return { error: 'Selecione uma UF válida para o CRM.' };
  if (!/^[1-9]\d9\d{8}$/.test(data.celular)) return { error: 'Informe um celular com DDD e 9 dígitos.' };
  if (data.especialidade.length < 2 || data.especialidade.length > 100) return { error: 'Informe sua especialidade (2 a 100 caracteres).' };
  return { data };
}
