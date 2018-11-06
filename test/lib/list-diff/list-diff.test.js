import listDiff from '../../../lib/list-diff/list-diff'

describe('diff', () => {
  it('can diff and get right result', () => {
    const arr1 = [
      {id: 0},
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
    ];
    const arr2 = [
      {id: 4},
      {id: 1},
      {id: 6},
      {id: 8},
      {id: 3},
      {id: 7},
      {id: 5},
      {id: 0},
      {id: 9},
    ];
    const {
      moves,
      children
    } = listDiff(arr1, arr2, 'id')

    const simulator = arr1.slice(0)

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]
      switch (move.type) {
        case 0:
          simulator.splice(move.index, 1)
          break
        case 1:
          simulator.splice(move.index, 0, move.item)
          break
      }
    }

    expect(arr2).toEqual(simulator)
  })
})
