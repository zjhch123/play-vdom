import '@css/base.css';
import '@css/style.scss';
import el from '../lib/v-dom/element'
import diff from '../lib/v-dom/diff'
const svd = require('simple-virtual-dom')
const standardDiff = svd.diff


// 这是为了更新html之后页面能自动刷新而写的。不要删
if (process.env.NODE_ENV !== 'production') {
  require('./index.html')
}

const tree = el('div', {}, [
  el('h1', { style: 'color: #45b97c' }, 'zjhch123!!!'),
  el('h2', { style: 'color: #c7a252' }, 'zjhch456!!!'),
  el('div', { style: 'color: #c7a252' }, [
    el('span', { style: 'color: #009ad6' }, 'haha, '),
    el('span', { style: 'color: #7bbfea' }, 'good boy!')
  ]),
])

const tree2 = el('div', { style: 'color: red' }, [
  el('h1', { style: 'color: #45b97c' }, 'zjhch123!!'),
  el('h2', { style: 'color: #c7a252' }, 'zjhch456!!!!'),
  el('div', { style: 'color: #c7a253' }, [
    el('span', { style: 'color: #009ad6' }, 'haha, '),
    el('span', { style: 'color: #7bbfea' }, 'good boy!')
  ]),
])

console.log(diff(tree, tree2))

console.log(standardDiff(tree, tree2))

document.querySelector('.container').appendChild(tree.render())
