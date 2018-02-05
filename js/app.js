// DATA CONTROLLER
var dataController = (function(){
    // Meal and Ingredient Function constructors
    var Meal = function(id, title) {
        this.id = id;
        this.title = title;
    };

    var Ingredient = function(id, description) {
        this.id = id;
        this.description = description;
    };

    var data = {
        allItems: {
            meal: [],
            ing: []
        }
    };

    return {
        addItem: function(type, list, des) {
            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item
            if (type === 'meal') {
                newItem = new Meal(ID, des);
            } else if (type === 'ing') {
                newItem = new Ingredient(ID, des);
            }

            // Push into data structure
            data.allItems[type].push(newItem);

            // Return new item
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        }
    };

})();

// UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputList: '.add__list',
        inputDescription: '.add__description',
        inputBtn: '.add__btn',
        ingredientsContainer: '.ingredients__list',
        shoppingContainer: '.shopping__list',
        inventoryContainer: '.inventory__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                list: document.querySelector(DOMstrings.inputList).value,
                description: document.querySelector(DOMstrings.inputDescription).value
            }
        },

        addListItem: function(obj, type, list) {
            var html, newHtml;

            // Create HTML string with placeholder text
            if (type === 'meal') {
                element = DOMstrings.ingredientsContainer;
                html = '<div class="meal clearfix" id="meal-%id%"><div class="meal__title">%title%</div><div class="right"><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'ing') {
                element = [DOMstrings.ingredientsContainer, list === 'shopping' ? DOMstrings.shoppingContainer : DOMstrings.inventoryContainer];
                html = '<div class="item clearfix" id="ing-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace %placeholder text% with actual data
            newHtml = html.replace('%id%', obj.id);
            if (obj.hasOwnProperty('title')) {
                newHtml = newHtml.replace('%title%', obj.title);
            } else {
                newHtml = newHtml.replace('%description%', obj.description);
            }

            // Insert HTML into the DOM
            if (Array.isArray(element)) {
                element.forEach(function(el) {
                    document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
                });
            } else {
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            }
        },

        deleteListItem: function(itemType, idNum) {
            var els = document.querySelectorAll(`#${itemType}-${idNum}`);
            elsArray = Array.prototype.slice.call(els);
            elsArray.forEach(function(el) {
                el.parentNode.removeChild(el);
            });
        },

        clearFields: function() {
            var field;

            field = document.querySelector(DOMstrings.inputDescription);
            field.value = "";
            field.focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

// APP CONTROLLER
var controller = (function(dataCtrl, UICtrl){
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.ingredientsContainer).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', function(){
            document.querySelector(DOM.inputList).classList.add('active');
            if (this.value === 'meal') {
                document.querySelector(DOM.inputList).classList.remove('active');
            }
        });
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // Get field input data
        input = UICtrl.getInput();

        if (input.description !== "") {
            // Add item to data controller
            newItem = dataCtrl.addItem(input.type, input.list, input.description);

            // Add item to the UI
            UICtrl.addListItem(newItem, input.type, input.list);

            // Clear the fields
            UICtrl.clearFields();

        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete item from data structure
            dataCtrl.deleteItem(type, ID);

            // Delete item from the UI
            UICtrl.deleteListItem(type, ID);
        }
    };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };

})(dataController, UIController);

controller.init();

// TODO
// style shopping list to stand out
// add some styling to empty lists (ingredients, shopping, inventory)
