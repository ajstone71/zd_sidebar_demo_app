// Class declaration & methods
class JabroniDropdownTwo {
    constructor(dropdown, searchInputDiv, searchInput) {
        this.searchInputDiv = searchInputDiv;
        this.dropdown = dropdown;
        this.searchInput = searchInput;
        this.arr = []

        searchInput.addEventListener("focus", (event) => {
            this.Focus(event)
        })

        searchInput.addEventListener("focusout", (event) => {
            this.FocusOut(event)
        })

        searchInput.addEventListener("keyup", (event) => {
            this.FilterOptions(event)
        })
    }

    Focus = () => {
        let dd = this.dropdown
        dd.style.display = "flex";  // Does it's job
    }
      
    FocusOut = () => {
        let dd = this.dropdown
        setTimeout(function() {
            dd.style.display = "none"  // Does it's job
        }, 200);
    }

    PopulateDiv = async function (existingTags, arr) {
        let tagDiv = this.searchInputDiv
        let tagInput = this.searchInput
        if (existingTags.length >= 1) {
            existingTags.forEach(await function (element, index) {
                let name;
                let key;
                let tag = document.createElement('div');
                tag.className = 'item';
                tag.setAttribute('data-remove', false);
                let removeTag = document.createElement('div');
                removeTag.innerHTML = `<i class="fas fa-times"></i>`;
                removeTag.className = "remove-item";
                if(typeof element === 'object' && element !== null) {
                    if("Name" in element) { name = element.Name } 
                    else if ("name" in element) { name = element.name } 
                    else if ("value" in element) { name = element.value }
                    if("Key" in element) { key = element.Key } 
                    else if ("id" in element) { key = element.id }
                    tag.innerHTML = name
                    tag.setAttribute('data-label', name);
                    tag.setAttribute('data-id', key);
                    arr.push(name)
                } else {
                    tag.innerHTML = element
                    tag.setAttribute('data-label', element);
                    arr.push(element)
                }
                tagDiv.insertBefore(tag, tagInput)
                tag.append(removeTag)
                let tagItems = document.getElementsByClassName("item");
                let removeTagEle = document.getElementsByClassName("remove-item");
                for (let i = 0; i < tagItems.length; i++) {
                    if (tagItems.length > -1) {
                        removeTagEle[i].addEventListener('click',(event) => {
                            if (event.target.classList.contains("fa-times")) {
                                let tagValue = tagItems[i].getAttribute("data-label");
                                let index = arr.indexOf(tagValue);
                                if (index > -1) {
                                    let eleToRemove = document.getElementsByClassName("item")[i]
                                    arr.splice(index, 1);
                                    eleToRemove.setAttribute('data-remove', true);
                                    eleToRemove.style.display = "none"
                                }
                            }
                        })
                    }
                }
            })
        }
        return existingTags;
    }

    PopulateDropdown = (result, existingTags) => {
        if (existingTags === undefined) { existingTags = [] }
        let tagDiv = this.searchInputDiv;
        let tagInput = this.searchInput;
        let dd = this.dropdown;
        result.forEach(element => {
            let val
            if (element.value) { val = element.value } else if (element.name) { val = element.name }else{ val = element}
            let possibleTag = document.createElement('div');
            possibleTag.className = 'option-dropdown';
            possibleTag.innerHTML = val;
            if (element.id) { possibleTag.setAttribute('data-id', element.id); }
            dd.append(possibleTag)
        });
        let optionsEle = document.getElementsByClassName("option-dropdown");
        for (let i = 0; i < optionsEle.length; i++) {
            optionsEle[i].addEventListener("click", function(event){
                if (event.target.classList.contains('option-dropdown') && dd.contains(event.target)) {
                    existingTags.push(optionsEle[i].innerText)
                    let latest = existingTags[existingTags.length - 1]
                    let tag = document.createElement('div');
                    let removeTag = document.createElement('div');
                    tag.innerHTML = latest
                    tag.className = 'item';
                    tag.setAttribute('data-label', optionsEle[i].innerText);
                    if (optionsEle[i].getAttribute('data-id')) { tag.setAttribute('data-id', optionsEle[i].getAttribute('data-id')); }
                    tag.setAttribute('data-remove', false);
                    removeTag.innerHTML = `<i class="fas fa-times"></i>`;
                    removeTag.className = "remove-item";
                    tagDiv.insertBefore(tag, tagInput)
                    tag.append(removeTag)
                    let tagItems = document.getElementsByClassName("item");
                    let removeTagEle = document.getElementsByClassName("remove-item");
                    for (let i = 0; i < tagItems.length; i++) {
                        if (tagItems.length > -1) {
                            removeTagEle[i].addEventListener('click',(event) => {
                                let grandparent = tagDiv.id
                                if (event.target.classList.contains("fa-times") && removeTagEle[i].closest(`#${grandparent}`)) {
                                    let tagValue = tagItems[i].getAttribute("data-label")
                                    let index = existingTags.indexOf(tagValue);
                                    if (index > -1) {
                                        let eleToRemove = document.getElementsByClassName("item")[i]
                                        existingTags.splice(index, 1);
                                        eleToRemove.setAttribute('data-remove', true);
                                        eleToRemove.style.display = "none"
                                    }
                                }
                            })
                        }
                    }
                }
                tagInput.value = ""
                dd.style.display = "none";
            })
        } 
        return existingTags;
    }

    FilterOptions = function (event) {
        let dd = this.dropdown
        let options = dd.getElementsByClassName("option-dropdown");
        event.preventDefault();
        if (event.keyCode !== 13) {
            let term = event.target.value.toLowerCase();
            Array.from(options).forEach(function(option){
                let val = option.innerText;
                if(val.toLowerCase().indexOf(term) != -1) {
                    option.style.display = "flex"
                } else {
                    option.style.display = "none"
                }
            })   
        }
    }
}
