export class SelectableList {

    constructor(listElement) {
        this.listElement = listElement

        this.listElement.addEventListener("click", function(){

            // ensure target is html list element
            if (event.target.tagName != "LI") return;
                
            event.target.classList.toggle('selected');

        }, false);

        listElement.SelectableList = this
    }

    onClick(clickFunction){

        this.listElement.addEventListener("click", function(event){

            let listClass = event.currentTarget.SelectableList

            console.log(event);
            
            

            let indexOfSelected = getSelectedListItem(event.target.parentElement)
    
            clickFunction(indexOfSelected)
            
        }, false);
            
    }

    setHtmlList(listItems){
        
        this.currentList = listItems
        this.listElement.innerHTML = " ";
    
        listItems.forEach(item => {
            let listItem = document.createElement('li')
            listItem.innerHTML = item
            this.listElement.appendChild(listItem)
        })
    }

}





// export function makeListSelectable(listElement, onClick){

//     listElement.onclick = function(event){
//         if (event.target.tagName != "LI") return;

//         // let selected = listElement.querySelectorAll('.selected');
//         // selected.forEach(elem => elem.classList.remove('selected'))
//         event.target.classList.toggle('selected');

//         onClick(getSelectedListItem(listElement))
//     }
// }

function getSelectedListItem(listElement){
    let nodes = listElement.childNodes;
    var numberOfTextNodes = 0
    var selectedIndexes = []

    // loop trough nodes
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // filter out non text nodes
        if(node.nodeType == 1){

            if(node.className == 'selected'){

                // use numberOfTextNodes as index
                selectedIndexes.push(numberOfTextNodes)
            }

            // count text nodes
            numberOfTextNodes += 1

        }
    }

    // if none is selected: -1, else: array
    return (selectedIndexes.length > 0) ? selectedIndexes : -1
}