const fs = require('fs');

let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

let cafeMenuUseEffect = `  const [allItems, setAllItems] = React.useState([]);

  React.useEffect(() => {
    const fetchCafeMenu = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_cafe.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data)) {
            setAllItems(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cafe menu:", error);
      }
    };
    fetchCafeMenu();
  }, []);`;

c = c.replace(/const allItems = \[\s*\{[\s\S]*?\];/g, cafeMenuUseEffect);

// Replace mapping in CafeMenuTab
c = c.replace(/\{allItems\.filter\(item => item\.cat === activeCategory\)\.map\(\(item, idx\) => \(/g, 
  `{allItems.filter(item => item.category === activeCategory).map((item, idx) => (`);

c = c.replace(/<h4 className="admin-menu-item-title">{item\.name}<\/h4>/g, `<h4 className="admin-menu-item-title">{item.title}</h4>`);
c = c.replace(/<span className="admin-menu-item-price">₹{item\.price}<\/span>/g, `<span className="admin-menu-item-price">₹{item.price}</span>`);
c = c.replace(/<p className="admin-menu-item-desc">{item\.desc}<\/p>/g, `<p className="admin-menu-item-desc">{item.description}</p>`);

let cafeFeaturedUseEffect = `  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_cafe.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data)) {
            setItems(data.data.filter(item => item.is_featured == 1));
          }
        }
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
      }
    };
    fetchFeatured();
  }, []);`;

c = c.replace(/const items = \[\s*\{[\s\S]*?\];/g, cafeFeaturedUseEffect);

c = c.replace(/<span className="admin-cell-muted">Original: ₹{item\.origPrice}<\/span>/g, `<span className="admin-cell-muted">Original: ₹{item.original_price}</span>`);
c = c.replace(/<span className=\{item\.veg \? 'admin-text-veg' : 'admin-text-nonveg'\}>/g, `<span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'}>`);
c = c.replace(/\{item\.veg \? 'Veg' : 'Non-Veg'\}/g, `{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}`);
c = c.replace(/<img src=\{item\.img\}/g, `<img src={item.image_url || cafe1}`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched Cafe Tabs");
