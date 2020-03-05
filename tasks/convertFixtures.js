const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const transliterate = require('../libs/transliterate');
const faker = require('faker');
const dataDir = path.resolve(__dirname, '../data');
const originalDataDir = path.resolve(__dirname, '../original_data');
const files = fs.readdirSync(originalDataDir);

const db = require('../libs/db');

faker.seed(1);

const productsByCategoryMax = Object.create(null);

function makeSlug(str) {
  return transliterate(str.toLowerCase().replace(/ /g, '-'));
}

module.exports = async function() {
  const categories = [];

  const productSlugSet = new Set();

  const products = [];

  for (const file of files) {
    if (file[0] === '~') continue;
    if (!file.endsWith('.xlsx')) continue;

    console.log(`processing ${file} ...`);

    const workbook = XLSX.readFile(path.resolve(originalDataDir, file));
    const sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheet_name];

    const items = XLSX.utils.sheet_to_json(worksheet);

    for (const product of items) {
      // skip products w/o desc
      if (!product['Описание']) continue;

      const title = product['Имя товара'];
      const slug = makeSlug(title);

      if (productSlugSet.has(slug)) continue;
      productSlugSet.add(slug);

      const category = product['Категория'];
      const subcategory = product['Подкатегория 2'];
      const subcategorySlug = makeSlug(subcategory);
      const categorySlug = makeSlug(category);

      let categoryObj = categories.find(c => c.id === categorySlug);
      if (!categoryObj) {
        categoryObj = {id: categorySlug, title: category, children: [], count: 0};
        categories.push(categoryObj)
      }

      let subcategoryObj = categoryObj.children.find(c => c.id === subcategorySlug);
      if (!subcategoryObj) {
        subcategoryObj = {id: subcategorySlug, title: subcategory, count: 0};
        categoryObj.children.push(subcategoryObj);
      }

      if (!productsByCategoryMax[subcategoryObj.id]) {
        productsByCategoryMax[subcategoryObj.id] = faker.random.number({min: 8, max: 20});
      }
      if (subcategoryObj.count >=  productsByCategoryMax[subcategoryObj.id]) {
        continue;
      }

      let productObj = {
        id:          slug,
        title,
        description: product['Описание'].replace(/<div rel="v:rating">.*<\/div>/, ''),
        quantity:    faker.random.number({min: 1, max: 100}),
        // category:    categorySlug,
        subcategory: subcategorySlug,
        status:     faker.random.number({min: 1, max: 10}) === 10 ? 0 : 1,
        images:      product['Ссылки на фото (через пробел)']
                       .split(' ')
                       .map(link => link.trim())
                       .slice(0, 5)
                       .map(link => ({
                         url: link,
                         source: path.basename(link)
                       })),
        price:       Math.round(product['Цена'].replace(/\s/g, '').replace(',', '.') / 60), // make price integer for simplicity
        discount: 0
      };

      if (productObj.price > 100 && faker.random.number({min: 1, max: 5}) === 1) {
        productObj.discount = Math.round(productObj.price / 10);
      }

      products.push(productObj);

      subcategoryObj.count++;
      categoryObj.count++;
    }

  }

  // convert category.children to subcategories
  let subcategories = [];
  let categoryWeight = 1;
  for (let category of categories) {
    category.weight = categoryWeight++;

    let children = category.children;
    delete category.children;
    let subcategoryWeight = 1;
    for (let subcategory of children) {
      subcategory.category = category.id;
      subcategory.weight = subcategoryWeight++;
      subcategories.push(subcategory);
    }
  }

  db.set('categories', categories);
  db.set('subcategories', subcategories);
  db.set('products', products);
  db.validateSelf();
  db.save();
};

