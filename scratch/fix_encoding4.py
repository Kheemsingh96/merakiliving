import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("price: '?4,500'", "price: '?4,500'")
c = c.replace("price: '?3,800'", "price: '?3,800'")
c = c.replace("price: '?7,200'", "price: '?7,200'")
c = c.replace("price: '?18,000'", "price: '?18,000'")
c = c.replace(">?1,48,750<", ">?1,48,750<")
c = c.replace("Price (?)", "Price (?)")
c = c.replace('admin-price-symbol">?<', 'admin-price-symbol">?<')
c = c.replace(">? 18.6%<", ">? 18.6%<")
c = c.replace(">? 22.4%<", ">? 22.4%<")
c = c.replace(">? 16.8%<", ">? 16.8%<")
c = c.replace(">? 8.4%<", ">? 8.4%<")

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Replaced literal ? symbols')
