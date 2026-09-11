import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

# U+FFFD is the replacement character
# Also replace '?' if they are literally ? but we don't want to break ternary operators.
# We'll rely on replacing the specific strings using U+FFFD.

c = c.replace("price: '\ufffd4,500'", "price: '?4,500'")
c = c.replace("price: '\ufffd3,800'", "price: '?3,800'")
c = c.replace("price: '\ufffd7,200'", "price: '?7,200'")
c = c.replace("price: '\ufffd18,000'", "price: '?18,000'")
c = c.replace(">\ufffd1,48,750<", ">?1,48,750<")
c = c.replace("Price (\ufffd)", "Price (?)")
c = c.replace('admin-price-symbol">\ufffd<', 'admin-price-symbol">?<')
c = c.replace(">\ufffd 18.6%<", ">? 18.6%<")
c = c.replace(">\ufffd 22.4%<", ">? 22.4%<")
c = c.replace(">\ufffd 16.8%<", ">? 16.8%<")
c = c.replace(">\ufffd 8.4%<", ">? 8.4%<")

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Replaced U+FFFD symbols')
