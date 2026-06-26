# Campus Quest

App mobile para gamificação de presença em aula. O aluno faz check-in tirando uma selfie e confirmando a localização, ganha pontos e compete com o grupo.

## Arquitetura

O app em React Native/Expo se comunica com uma API REST via axios usando Bearer token. A autenticação é gerenciada pelo `AuthContext`, que persiste o JWT no `SecureStore`. Os dados de tela ficam cacheados no `AsyncStorage` via `useOfflineResource`. Notificações push passam pelo Firebase Cloud Messaging. O CI builda via EAS e distribui o APK pelo Firebase App Distribution.

### Navegação

O `AppRoutes` decide qual stack exibir com base no estado da sessão: sem sessão vai pro Onboarding (Welcome, Login, Register); autenticado mas sem grupo vai pro GroupSetup (Choice, Create, Join); autenticado com grupo abre o Main com as abas Home, Groups, Profile e Settings. A aba Home tem um stack modal de check-in com as telas Camera, Confirm e Success.

### Fluxo de check-in

A `CameraScreen` consulta `/check-ins/current-class` pra saber se há aula no momento e solicita permissão de câmera e localização. Após a foto, vai pra `ConfirmScreen`, que envia um `POST /check-ins` com a foto e coordenadas. Resposta 200 vai pra `SuccessScreen` com pontos e streak. 409 significa que já fez check-in hoje e também vai pra `SuccessScreen`. 422 com `TOO_FAR` exibe o erro de distância.

## Setup

**Pré-requisitos:** Node 20+, `eas-cli` global, Android Studio ou device físico.

```bash
npm install
cp .env.example .env   # ajusta o IP do servidor local
npm run dev
```

O `EXPO_PUBLIC_API_URL` do `.env` só vale em dev. Em preview/production o `eas.json` sobrescreve com a URL de produção.

```bash
npm test
npm run build:preview:android   # gera APK via EAS Cloud
```

## Decisões técnicas

**Offline-first** — `useOfflineResource` serve o cache do `AsyncStorage` imediatamente, busca dado fresco em paralelo e agenda retry de 5 s em caso de falha. Telas principais nunca ficam em branco por falta de rede.

**JWT no SecureStore** — token guardado no keychain/keystore nativo. O perfil do estudante vai pro `AsyncStorage` (prefixo `campus-quest.cache.*`) só para restaurar a sessão sem depender de rede na inicialização.

**Interceptor 401 centralizado** — o `apiClient` tem um único interceptor que chama o logout do `AuthContext` em qualquer 401, sem tratar isso em cada service.

**Erros de check-in tipados** — `submitCheckIn` relança `TooFarError` (com `distanceMeters`) e `Error("ALREADY_CHECKED_IN")` em vez do erro bruto do axios, mantendo a UI desacoplada dos detalhes HTTP.

**Cleartext traffic via plugin** — `usesCleartextTraffic` é injetado no `AndroidManifest.xml` por um plugin customizado no `app.config.ts`, sem sair do managed workflow do Expo.

**CI sem Mac** — o workflow builda Android via EAS Cloud e distribui o APK pro Firebase App Distribution automaticamente. O job de iOS está comentado por falta de conta Apple Developer.
