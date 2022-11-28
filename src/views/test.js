

const array = [
    {
        name: 'shaheer',
        regno: 123
    },{
        regno: 123
    },
    'muqaddas'
]

const obj = {
    name: 'shaheer',
    regno: 123
}

array.forEach(element => {
    console.log(element.name)
})

array.map(element => {
    console.log(element.name)
})