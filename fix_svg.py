import re

with open('base64.txt', 'r') as f:
    b64 = f.read().strip()

with open('src/components/Suggestions.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(xlinkHref="data:image/png;base64,)[^"]*(")'
replacement = r'\1' + b64 + r'\2'
content = re.sub(pattern, replacement, content, count=1)

with open('src/components/Suggestions.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('SVG base64 data replaced successfully')
