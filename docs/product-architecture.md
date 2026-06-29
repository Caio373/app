# Psique & Pedagogia e Movimento — Arquitetura, Stack e MVP

## 1. Norte do produto

**Visão:** construir um diário de vínculo corpo-mente para conectar dados físicos mínimos com elaboração psíquica, humor, aprendizado e relações significativas.

**Slogan:** Onde há vínculo, há aprendizagem.

**Princípio central:** o app não compete com Strava, Nike Run Club ou apps de perda de peso. Ele existe para sustentar aprendizagem encarnada, reflexão pedagógica e cuidado emocional.

**Regra inegociável de produto:** não exibir nem otimizar por calorias, pace competitivo, perda de peso, rankings, streaks punitivos ou qualquer métrica que gere pressão. A árvore diária pode repousar, mas nunca morre.

## 2. Stack tecnológica recomendada

### 2.1 Aplicativo mobile

**Recomendação:** React Native com Expo Development Build.

Motivos:

- Excelente velocidade para MVP e iteração de produto.
- Boa integração com autenticação social, mapas, sensores, notificações, armazenamento local e pagamentos.
- Permite evoluir de Expo para módulos nativos quando o rastreamento GPS em segundo plano exigir mais controle.
- Ecossistema maduro para acessibilidade, internacionalização, theming e componentes de interface.

Bibliotecas mobile iniciais:

- `expo-location` ou módulo nativo dedicado para GPS em segundo plano.
- `react-native-maps` para visualização simples do percurso, sem tom competitivo.
- `@react-navigation/native` para navegação.
- `react-native-mmkv` ou SQLite local para cache offline criptografado.
- `react-native-keychain` ou SecureStore para chaves e segredos locais.
- `react-native-iap` para Apple App Store e Google Play Billing.
- `@stripe/stripe-react-native` para Stripe, quando aplicável fora das restrições de bens digitais.

### 2.2 Backend e sincronização

**Recomendação:** Supabase como base operacional do MVP, com PostgreSQL, Auth, Edge Functions e Storage.

Motivos:

- PostgreSQL favorece dados relacionais, histórico, relatórios e correlações entre movimento, humor, aprendizado e vínculo.
- Row Level Security ajuda a isolar dados por usuário.
- Supabase Auth cobre e-mail e OAuth; Apple e Google podem ser integrados ao fluxo mobile.
- Edge Functions simplificam webhooks de Stripe, Mercado Pago e validação de recibos de lojas.
- Permite evoluir para backend Node.js/NestJS dedicado quando houver necessidade de domínio mais complexo.

### 2.3 Serviços de domínio

- **API/Edge Functions:** TypeScript.
- **PDF:** geração server-side com template HTML/CSS elegante e renderização via Playwright ou serviço dedicado.
- **Pagamentos:** Stripe, Mercado Pago e In-App Purchases.
- **Observabilidade:** Sentry para app e backend; logs sem conteúdo sensível.
- **Analytics:** PostHog ou ferramenta equivalente em modo privacy-first, com eventos não sensíveis e consentimento explícito.

### 2.4 Criptografia e privacidade

Dados emocionais, psicológicos, pedagógicos e relacionais devem ser tratados como sensíveis. A arquitetura recomendada é:

- Criptografia em trânsito com TLS.
- Criptografia em repouso no banco e no dispositivo.
- Criptografia de campo para entradas sensíveis de diário antes do envio ao servidor.
- Chaves do usuário protegidas no dispositivo por Keychain/Secure Enclave no iOS e Keystore no Android.
- Backend sem capacidade de ler conteúdo sensível do diário, sempre que tecnicamente viável.
- Política de minimização: coletar apenas dados necessários para o funcionamento terapêutico-pedagógico.
- Exportação, exclusão e portabilidade de dados como fluxos de produto de primeira classe.

## 3. Arquitetura lógica

```text
Mobile App React Native
  ├─ UI acolhedora e acessível
  ├─ Diário local offline-first
  ├─ Rastreamento GPS básico
  ├─ Criptografia local
  ├─ Sync queue
  └─ IAP / Stripe / Mercado Pago client hooks

Supabase / Backend TypeScript
  ├─ Auth e perfis
  ├─ PostgreSQL com RLS
  ├─ Edge Functions
  ├─ Webhooks de pagamento
  ├─ Validação de recibos das lojas
  ├─ Geração de PDF
  └─ Storage para PDFs e assets premium

Serviços externos
  ├─ Apple ID / Google OAuth
  ├─ Apple App Store IAP
  ├─ Google Play Billing
  ├─ Stripe
  ├─ Mercado Pago com PIX e cartão
  └─ Sentry / observabilidade
```

## 4. Arquitetura de banco de dados recomendada

### 4.1 Diretrizes gerais

- Banco principal: PostgreSQL.
- Todas as tabelas de dados do usuário devem ter `user_id`, `created_at`, `updated_at`, `deleted_at` e campos de sincronização.
- Usar soft delete para permitir sincronização offline e recuperação até a exclusão definitiva.
- Ativar Row Level Security em todas as tabelas multiusuário.
- Separar metadados pesquisáveis de conteúdo sensível criptografado.
- Nunca armazenar métricas proibidas como calorias, peso, objetivo de emagrecimento ou ranking competitivo.

### 4.2 Entidades principais

#### `profiles`

Perfil público-privado mínimo do usuário.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Mesmo id do usuário autenticado |
| `display_name` | text | Nome exibido |
| `locale` | text | Ex.: `pt-BR` |
| `timezone` | text | Ex.: `America/Sao_Paulo` |
| `accessibility_open_dyslexic` | boolean | Preferência de fonte acessível |
| `theme_preference` | text | Claro, escuro ou sistema |
| `consented_lgpd_at` | timestamptz | Consentimento LGPD |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

#### `daily_reflections`

Registro diário que alimenta a árvore.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono do registro |
| `reflection_date` | date | Dia local do usuário |
| `movement_completed` | boolean | Área Movimento preenchida |
| `mood_completed` | boolean | Área Humor preenchida |
| `learning_completed` | boolean | Área Aprendizado preenchida |
| `bond_completed` | boolean | Área Vínculo preenchida |
| `tree_state` | text | `seed`, `sprout`, `branches`, `golden_tree`, `rest`, `winter` |
| `encrypted_summary` | text | Síntese sensível criptografada |
| `sync_status` | text | `local`, `pending`, `synced`, `conflict` |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |
| `deleted_at` | timestamptz | Exclusão lógica |

Restrição recomendada: `unique(user_id, reflection_date)`.

#### `movement_sessions`

Sessão de caminhada ou movimento com GPS básico.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono da sessão |
| `daily_reflection_id` | uuid | Dia associado |
| `started_at` | timestamptz | Início |
| `ended_at` | timestamptz | Fim |
| `duration_seconds` | integer | Tempo total |
| `distance_meters` | integer | Distância básica |
| `route_polyline_encrypted` | text | Rota criptografada |
| `pre_prompt_encrypted` | text | Resposta ao prompt pré-treino |
| `post_insight_encrypted` | text | Insight pós-treino |
| `post_emotion_encrypted` | text | Emoção pós-treino |
| `post_gratitude_encrypted` | text | Gratidão pós-treino |
| `status` | text | `draft`, `active`, `completed`, `discarded` |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |
| `deleted_at` | timestamptz | Exclusão lógica |

Observação: distância e duração podem ser mantidas em claro para relatórios básicos, mas rota e textos devem ser criptografados.

#### `mood_entries`

Registro emocional diário.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono do registro |
| `daily_reflection_id` | uuid | Dia associado |
| `mood_label` | text | Categoria não sensível ou pseudonimizada |
| `valence` | smallint | Escala suave, não competitiva, de -2 a 2 |
| `energy` | smallint | Escala de -2 a 2 |
| `body_sensation_encrypted` | text | Sensações corporais |
| `note_encrypted` | text | Texto livre |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |
| `deleted_at` | timestamptz | Exclusão lógica |

#### `bond_entries`

Interações significativas com familiares, alunos ou comunidade.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono do registro |
| `daily_reflection_id` | uuid | Dia associado |
| `bond_context` | text | `familia`, `alunos`, `colegas`, `comunidade`, `outro` |
| `development_lens` | text | Ex.: vínculo, autonomia, linguagem, regulação, brincadeira |
| `interaction_note_encrypted` | text | Descrição sensível |
| `felt_learning_encrypted` | text | Aprendizagem percebida |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |
| `deleted_at` | timestamptz | Exclusão lógica |

#### `learning_entries`

Notas de aula, leitura e insight pedagógico.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono do registro |
| `daily_reflection_id` | uuid | Dia associado |
| `source_type` | text | `aula`, `leitura`, `observacao`, `insight`, `outro` |
| `title_encrypted` | text | Título criptografado |
| `note_encrypted` | text | Texto livre criptografado |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |
| `deleted_at` | timestamptz | Exclusão lógica |

#### `subscriptions`

Estado de plano do usuário.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono |
| `plan` | text | `free` ou `premium_garden` |
| `provider` | text | `stripe`, `mercado_pago`, `apple_iap`, `google_play` |
| `provider_customer_id` | text | Id externo |
| `provider_subscription_id` | text | Id externo |
| `status` | text | `active`, `trialing`, `past_due`, `canceled`, `expired` |
| `current_period_end` | timestamptz | Vigência |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

#### `export_jobs`

Pedidos de exportação em PDF.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono |
| `period_start` | date | Início |
| `period_end` | date | Fim |
| `status` | text | `queued`, `processing`, `completed`, `failed` |
| `storage_path` | text | Caminho do PDF |
| `created_at` | timestamptz | Criação |
| `updated_at` | timestamptz | Atualização |

#### `sync_events`

Fila e auditoria técnica de sincronização, sem conteúdo sensível.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | Identificador |
| `user_id` | uuid | Dono |
| `entity_type` | text | Tipo de entidade |
| `entity_id` | uuid | Registro afetado |
| `operation` | text | `create`, `update`, `delete` |
| `client_mutation_id` | uuid | Idempotência |
| `device_id` | text | Dispositivo |
| `occurred_at` | timestamptz | Momento local/cliente |
| `synced_at` | timestamptz | Momento servidor |

### 4.3 Relatórios e correlações

Para o MVP, relatórios semanais e mensais podem ser calculados sob demanda a partir de:

- `daily_reflections` para crescimento da árvore.
- `movement_sessions` para dias com movimento, duração e distância.
- `mood_entries` para variações suaves de humor.
- `bond_entries` para frequência e contexto de vínculo.

No Premium, criar uma materialized view ou tabela agregada `wellbeing_weekly_summaries` para acelerar leituras e gerar cruzamentos como: dias com movimento concluído versus valência média de humor e presença de registros de vínculo.

## 5. Experiência de produto

### 5.1 Home — Sua Árvore Hoje

A home deve mostrar uma árvore dourada orgânica em fundo off-white. Cada área preenchida adiciona um elemento visual:

- Movimento: raízes ou tronco mais firme.
- Humor: folhas em variação suave.
- Aprendizado: novos brotos.
- Vínculo: ramos conectados.

Se o usuário não usar o app por alguns dias, a árvore entra em repouso ou inverno. Nunca usar linguagem de perda, morte, falha ou punição.

### 5.2 Fluxo de Movimento

1. Usuário toca em **Iniciar Movimento**.
2. App pede obrigatoriamente: **O que você quer elaborar mentalmente nessa caminhada?**
3. GPS inicia percurso básico com tempo e distância, sem pace competitivo.
4. Ao finalizar, app solicita obrigatoriamente:
   - 1 insight.
   - 1 emoção.
   - 1 gratidão.
5. O dia marca Movimento como concluído e a árvore cresce.

### 5.3 Humor, Vínculo e Aprendizado

- Humor deve priorizar linguagem afetiva e corporal, não diagnóstico.
- Vínculo deve apoiar reflexão sobre relações familiares, pedagógicas ou comunitárias.
- Aprendizado deve aceitar notas curtas e não exigir formalidade acadêmica.

## 6. Acessibilidade e identidade visual

- Paleta principal: azul-marinho/petróleo `#0B2545` ou `#1B2B4B`, dourado `#A3702C` ou `#C9A145`, fundo off-white `#F8F9FA` ou `#F5F3EF`.
- Títulos com tipografia serifada clássica.
- OpenDyslexic como opção nativa de acessibilidade.
- Contraste adequado, alvos de toque confortáveis e textos claros.
- Interface limpa, orgânica e sem excesso de números.

## 7. Modelo freemium e pagamentos

### Plano gratuito

- Caminhada com GPS básico.
- Árvore diária.
- Prompt pré-movimento.
- Registro básico pós-movimento.
- Histórico limitado.

### Plano Premium — Jardim Completo

- Histórico ilimitado.
- Exportação de PDF elegante em alta qualidade.
- Cruzamentos avançados entre movimento, humor e vínculos.
- Pílulas de áudio do Conselho de Notáveis.
- Possíveis coleções temáticas de reflexão pedagógica.

### Gateways

- Apple In-App Purchases para iOS quando a compra desbloquear conteúdo digital no app.
- Google Play Billing para Android quando a compra desbloquear conteúdo digital no app.
- Stripe para pagamentos web e contextos permitidos.
- Mercado Pago para Brasil, com PIX e cartão de crédito, principalmente em checkout web ou fluxos compatíveis com políticas das lojas.

## 8. Plano de ação em sprints para o MVP

### Sprint 0 — Fundação de produto e arquitetura

Objetivos:

- Definir escopo fechado do MVP.
- Criar design system inicial.
- Validar riscos de LGPD, criptografia, pagamentos e GPS em segundo plano.

Entregas:

- Documento de arquitetura e modelo de dados.
- Protótipo navegável de baixa/média fidelidade.
- Decisão final sobre Expo Development Build, Supabase e bibliotecas críticas.
- Backlog priorizado com critérios de aceite.

### Sprint 1 — Base mobile, identidade visual e autenticação

Objetivos:

- Criar app React Native.
- Implementar navegação, tema, acessibilidade e autenticação.

Entregas:

- Onboarding com posicionamento do produto.
- Login por e-mail, Google e Apple ID.
- Preferência de fonte OpenDyslexic.
- Home inicial com árvore estática.
- Estrutura de armazenamento local criptografado.

### Sprint 2 — Diário diário e árvore orgânica

Objetivos:

- Implementar o registro das quatro áreas diárias.
- Fazer a árvore crescer sem mecânicas punitivas.

Entregas:

- `daily_reflections` local e remoto.
- Estados visuais da árvore: semente, broto, ramos, árvore dourada e repouso.
- Módulos de Humor, Aprendizado e Vínculo em versão básica.
- Sincronização inicial offline-first.

### Sprint 3 — Movimento com GPS e prompts obrigatórios

Objetivos:

- Implementar caminhada com elaboração pré e pós-movimento.
- Garantir funcionamento offline.

Entregas:

- Botão Iniciar Movimento.
- Prompt obrigatório pré-treino.
- Rastreamento de tempo, distância e rota básica.
- Prompt obrigatório pós-treino com insight, emoção e gratidão.
- Persistência local e sincronização posterior.

### Sprint 4 — Histórico, relatórios básicos e privacidade

Objetivos:

- Entregar visão semanal/mensal simples.
- Reforçar LGPD e segurança.

Entregas:

- Histórico limitado no plano gratuito.
- Relatório semanal de crescimento da árvore.
- Correlação simples entre dias com movimento, humor e vínculo.
- Fluxos de exportação de dados brutos, exclusão de conta e consentimento.
- Revisão de RLS e criptografia de campos sensíveis.

### Sprint 5 — Premium e exportação PDF

Objetivos:

- Lançar monetização inicial e diferenciais premium.

Entregas:

- Entitlements de plano Free e Premium.
- Integração inicial com IAP Apple/Google.
- Webhooks para Stripe e Mercado Pago, se houver checkout web.
- Exportação de PDF elegante para terapia ou reflexão pedagógica.
- Histórico ilimitado para Premium.

### Sprint 6 — Beta fechado e preparação de lançamento

Objetivos:

- Validar usabilidade, bateria, GPS e linguagem emocional.

Entregas:

- Beta com grupo de usuários reais.
- Ajustes de linguagem para evitar pressão ou gatilhos de ansiedade.
- Testes de bateria em segundo plano.
- Hardening de observabilidade sem logs sensíveis.
- Preparação para lojas, política de privacidade e termos de uso.

## 9. Critérios de aceite do MVP

- Usuário consegue criar conta e entrar com e-mail, Google ou Apple ID.
- Usuário consegue iniciar caminhada offline depois de autenticado.
- Usuário só inicia movimento após responder ao prompt pré-treino.
- Usuário só conclui movimento após registrar insight, emoção e gratidão.
- Home exibe crescimento da árvore a partir das quatro áreas diárias.
- App não exibe calorias, perda de peso, ranking ou pace competitivo.
- Dias sem uso não geram punição visual ou textual.
- Dados sensíveis são criptografados antes de sair do dispositivo, quando viável.
- Usuário consegue solicitar exportação ou exclusão de dados.
- Premium desbloqueia histórico ampliado e exportação PDF.

## 10. Próximos passos técnicos imediatos

1. Criar projeto React Native com Expo Development Build.
2. Configurar Supabase, ambientes `dev` e `staging`, RLS e migrations.
3. Implementar design tokens da identidade visual.
4. Prototipar componente da árvore em SVG/Canvas.
5. Criar camada offline-first com fila de sincronização idempotente.
6. Implementar fluxo vertical completo: login, árvore, movimento, prompts, sync e histórico básico.
