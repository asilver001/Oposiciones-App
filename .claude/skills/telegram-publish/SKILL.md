# Skill: Publicar en Telegram (@opositasmart)

## Trigger
Cuando el usuario pida publicar algo en Telegram, el canal de OpositaSmart, o compartir un quiz/post.

## Configuracion
- **Bot:** @OpositaSmart_bot
- **Canal:** @opositasmart (OpositaSmart — Tests AGE)
- **Chat ID:** -1003610320448
- **Token:** 8610214313:AAGXaHrkEwCvGpW8XForaMtD_1LG_Ree-2c

## IMPORTANTE: usar python3 para enviar (no curl)
curl falla con caracteres españoles (tildes, ñ, ¿). Usar siempre python3:

## Enviar quiz (pregunta tipo test)

```python
python3 -c "
import json, urllib.request
data = json.dumps({
    'chat_id': '-1003610320448',
    'question': '<PREGUNTA>',
    'options': ['a) ...', 'b) ...', 'c) ...', 'd) ...'],
    'type': 'quiz',
    'correct_option_id': <0-3>,
    'explanation': '<EXPLICACION max 200 chars>',
    'is_anonymous': True
}).encode('utf-8')
req = urllib.request.Request(
    'https://api.telegram.org/bot8610214313:AAGXaHrkEwCvGpW8XForaMtD_1LG_Ree-2c/sendPoll',
    data=data, headers={'Content-Type': 'application/json; charset=utf-8'})
print(urllib.request.urlopen(req).read().decode())
"
```

## Enviar mensaje de texto

```python
python3 -c "
import json, urllib.request
data = json.dumps({
    'chat_id': '-1003610320448',
    'text': '<MENSAJE>',
    'parse_mode': 'HTML',
    'disable_web_page_preview': False
}).encode('utf-8')
req = urllib.request.Request(
    'https://api.telegram.org/bot8610214313:AAGXaHrkEwCvGpW8XForaMtD_1LG_Ree-2c/sendMessage',
    data=data, headers={'Content-Type': 'application/json; charset=utf-8'})
print(urllib.request.urlopen(req).read().decode())
"
```

## Borrar mensaje

```python
python3 -c "
import json, urllib.request
data = json.dumps({'chat_id': '-1003610320448', 'message_id': <MSG_ID>}).encode('utf-8')
req = urllib.request.Request(
    'https://api.telegram.org/bot8610214313:AAGXaHrkEwCvGpW8XForaMtD_1LG_Ree-2c/deleteMessage',
    data=data, headers={'Content-Type': 'application/json; charset=utf-8'})
print(urllib.request.urlopen(req).read().decode())
"
```

## Obtener preguntas de Supabase

Usar MCP Supabase para sacar preguntas:
```sql
SELECT id, question_text, options, explanation, tema
FROM questions 
WHERE is_active = true AND confidence_score >= 0.9
ORDER BY random()
LIMIT 1;
```

Formato de `options` (JSONB):
```json
[
  {"text": "Opcion A", "is_correct": false},
  {"text": "Opcion B", "is_correct": true},
  {"text": "Opcion C", "is_correct": false},
  {"text": "Opcion D", "is_correct": false}
]
```

Mapeo: buscar el indice donde `is_correct = true` -> correct_option_id

## Templates

### Quiz diario (pregunta de la BD)
1. Consultar pregunta aleatoria de Supabase (confidence >= 0.9)
2. Formatear opciones como "a) Texto", "b) Texto", etc.
3. Truncar explicacion a max 200 chars (limite Telegram)
4. Mostrar al usuario para confirmar
5. Enviar con python3

### Blog post
```
{emoji} <b>{titulo}</b>\n\n{resumen 2-3 lineas}\n\nhttps://opositasmart-landing.vercel.app/blog/{slug}\n\n#oposiciones #auxiliaradministrativo
```

### Tip rapido
```
{emoji} <b>Tip del dia</b>\n\n{tip concreto}\n\n#oposiciones #tip
```

## Reglas
1. Mostrar el mensaje/quiz al usuario y pedir confirmacion ANTES de enviar
2. Tono conversacional (mismas reglas que blog-humano)
3. Mensajes de texto cortos (max ~300 chars)
4. 1-2 emojis por mensaje (solo en texto, no en quizzes)
5. Hashtags al final (solo en mensajes de texto, no en quizzes)
6. Para quizzes: verificar que la respuesta correcta coincide con la BD
7. **NUNCA promocionar OpositaSmart dentro de quizzes automatizados.** Muchos grupos donde se cross-postea el canal rechazan contenido con enlaces/branding externos. Si la explicacion excede 200 chars, truncar con `...` sin sufijo promocional (no "Mas en opositasmart.com", nada).
8. **NO enviar mensajes CTA de seguimiento** desde la Edge Function `telegram-daily-quiz`. El canal propio puede recibir promos manuales puntuales, pero los quizzes automatizados deben ir limpios.
9. **Telegram NO permite editar la explicacion de un quiz una vez publicado** (`editMessageText` no aplica a polls). Solo `stopPoll` o `deleteMessage`. Revisar ANTES de publicar.
