document.addEventListener('DOMContentLoaded',function () {
    //搜索设置
    function setSearch() {
        let searchInput = document.querySelector('.search-input')
        if(!searchInput){
            return
        }
        console.log('初始搜索')
        let searchCon = document.querySelector('.search-list-con')
        searchInput.addEventListener('focus',function () {
            searchCon.style.opacity = 1
            searchCon.style.display = 'block'
        })
        searchInput.addEventListener('blur',function () {
            searchCon.style.opacity = 0
            setTimeout(function () {
                searchCon.style.display = 'none'
                searchInput.value = ''
            },300)
        })
        searchInput.addEventListener('input',function () {
            var text = searchInput.value.toLocaleLowerCase()
            var searchLists = document.querySelectorAll('.search-list-item')
            searchLists.forEach(function (s) {
                var title = s.innerHTML.toLocaleLowerCase()
                var show = title.indexOf(text) != -1 || text == ''
                s.style.display = show ? 'block' : 'none'
            })
        })
    }
    setSearch()
})
