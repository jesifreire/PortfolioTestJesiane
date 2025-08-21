import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '30s',
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Teste de cadastro de usuário
  let res = http.post(`${BASE_URL}/user`, JSON.stringify({ email: `user${__VU}@test.com`, password: '123456' }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'cadastro status 200': (r) => r.status === 200 });

  // Teste de login
  res = http.post(`${BASE_URL}/login`, JSON.stringify({ email: `user${__VU}@test.com`, password: '123456' }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'login status 200': (r) => r.status === 200 });

  // Teste de adicionar exercício
  res = http.post(`${BASE_URL}/exercises`, JSON.stringify({ name: `Ex${__VU}`, category: 'Cardio', difficulty: 'Fácil' }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'add exercise status 200': (r) => r.status === 200 });

  // Teste de registrar exercício
  res = http.post(`${BASE_URL}/records`, JSON.stringify({ name: `Ex${__VU}`, category: 'Cardio', difficulty: 'Fácil', day: 'Seg', duration: 30 }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'register status 200': (r) => r.status === 200 });

  sleep(1);
}
