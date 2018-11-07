import el from '../lib/v-dom/element'
import diff from '../lib/v-dom/diff'
import patch from '../lib/v-dom/patch';

// 这是为了更新html之后页面能自动刷新而写的。不要删
if (process.env.NODE_ENV !== 'production') {
  require('./index.html')
}

let list = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
]

const tree = (list) => {
  return (
    <div>
      <a href="javascript:;" style="color: #45b97c">zjhch123!!!</a>
      <h2 style="color: #c7a252">zjhch456!!!</h2>
      <div>
        <span>haha, </span>
        <span>good boy!</span>
        <div>
        {
          list.map(i => (<span key={i.id}>{i.id}</span>))
        }
        </div>
      </div>
    </div>
  )
}

const tree1 = tree(list)
const root = tree1.render()

document.querySelector('.container').appendChild(root)

setTimeout(() => {
  const tree2 = tree([...list, {id: 777}, {id: 888}, {id: 999}])
  const patches = diff(tree1, tree2)
  console.log(patches)
  patch(root, patches)
}, 2000)
