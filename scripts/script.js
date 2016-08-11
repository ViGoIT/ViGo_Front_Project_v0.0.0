window.onload = function() {
    var asideLeftPanel = document.getElementById('asideLeftPanel'),
        asideRightPanel = document.getElementById('asideRightPanel'),
        myTable = document.getElementById('tableData'),
        allTh = document.querySelectorAll('thead th'),
        btnPlus = document.getElementById('btnPlus'),
        leftPanelDate = document.getElementById('leftPanelDate'),
        tableBody = document.getElementById('tableBody'),
        xhRequest = new XMLHttpRequest,
        urlToContent = 'json/content.json',
        contentToDOM = loadContent(),
        sortingOrderFlag = "",
        changedRowsArr = [],
        tableRowId,
        searchField = document.getElementById('search'),
        btnSearch = document.getElementsByClassName('btn-search')[0],
        btnCreate = document.getElementsByClassName('btn-create')[0],
        btnForMemebrs = document.getElementById('btnForMemebrs'),
        btnForType = document.getElementById('btnForType'),
        btnForCustomer = document.getElementById('btnForCustomer'),
        selectMembers = document.getElementsByClassName('pseudo-select-members')[0],
        selectType = document.getElementsByClassName('pseudo-select-type')[0],
        selectCustomer = document.getElementsByClassName('pseudo-select-customer')[0],
        rightPanelForm = document.getElementsByClassName('right-panel-form')[0],
        btnLeftPanel = document.getElementById('btnLeftPanel');


        /**add Listeners*/
        for(var i=0; i<allTh.length-1; i++) {
            allTh[i].addEventListener("click", sortTable, false);
        }

            btnLeftPanel.addEventListener("click", moveLeftPanel, false);
            btnPlus.addEventListener("click", moveRightPanel, false);
            tableBody.addEventListener("click", closeRightPanel, false);
            leftPanelDate.addEventListener("click", filterByDate, false);
            btnSearch.addEventListener("click", searchText, false);
            btnForMemebrs.addEventListener("click", expandMembers, false);
            btnForType.addEventListener("click", expandType, false);
            btnForCustomer.addEventListener("click", expandCustomer, false);
            selectMembers.addEventListener("click", chooseOption, false);
            selectType.addEventListener("click", chooseOption, false);
            selectCustomer.addEventListener("click", chooseOption, false);
            btnCreate.addEventListener("click", addToTable, false);
        //*******************
            getDate();
        //*******************
            function makeArr(nodeList) {
                var arr = [];
                //alert('makeArr:' +nodeList.length);
                for (var i = 0; i < nodeList.length; i++) {
                    arr.push(nodeList[i]);
                }
                return arr;
            }

            function clearClassName(nodeList) {

                for(var i=0; i < nodeList.length; i++) {

                    nodeList[i].className = "";
                }
            }

            function sortTable(event) {
                var allTr = document.querySelectorAll('tbody tr');
                var target = event.target,
                    allThArr = makeArr(allTh),
                    allTrArr = makeArr(allTr),
                    indexOfFirstTarget = allThArr.indexOf(target),
                    documentFragment = document.createDocumentFragment(),
                    //order = (target.className === "" || target.className === "desc") ? "asc" : "desc";
                    order = (sortingOrderFlag === "" || sortingOrderFlag === "descending") ? "ascending" : "descending";

                    //clearClassName(allTh);

                    allTrArr.sort(function (a, b) {

                    var tdA = a.children[indexOfFirstTarget].textContent,
                        tdB = b.children[indexOfFirstTarget].textContent;

                    if (tdA < tdB) {
                        return order === "ascending" ? -1 : 1;
                    } else if (tdA > tdB) {
                        return order === "ascending" ? 1 : -1;
                    } else {
                        return 0;
                    }
                });

                    allTrArr.forEach(function (tr) {
                        documentFragment.appendChild(tr);
                    });
                    sortingOrderFlag = order;
                    // target.className = order;
                    myTable.querySelector("tbody").appendChild(documentFragment);
            }

    //******************************************************************************************************************

    function expandMembers(event) {
        event.preventDefault();
        if(selectMembers.style.display=='none' || selectMembers.style.display==""){
            if((selectType.style.display=='none')&&(selectCustomer.style.display=='none')){
                selectMembers.style.display='block';
            } else {
                selectType.style.display='none';
                selectCustomer.style.display='none';
                selectMembers.style.display='block';
            }
        } else {
            selectMembers.style.display='none';
        }
    }

    function expandType(event) {
        event.preventDefault();
        if(selectType.style.display=='none' || selectType.style.display==""){
            if((selectMembers.style.display=='none')&&(selectCustomer.style.display=='none')){
                selectType.style.display='block';
            } else {
                selectMembers.style.display='none';
                selectCustomer.style.display='none';
                selectType.style.display='block';
            }
        } else {
            selectType.style.display='none';
        }
    }

    function expandCustomer(event) {
        event.preventDefault();
        if(selectCustomer.style.display=='none' || selectCustomer.style.display==""){
            if((selectMembers.style.display=='none')&&(selectType.style.display=='none')){
                selectCustomer.style.display='block';
            } else {
                selectMembers.style.display='none';
                selectType.style.display='none';
                selectCustomer.style.display='block';
            }
        } else {
            selectCustomer.style.display='none';
        }
    }

    function moveLeftPanel(){
        var display = window.getComputedStyle(asideLeftPanel,null).getPropertyValue('display');
        if(display=='none'){
            asideLeftPanel.classList.remove('display-none');
            tableData.classList.remove('change-width');
        } else {
            asideLeftPanel.classList.add('display-none');
            tableData.classList.add('change-width');
        }
    }

    function closeRightPanel(){

        asideRightPanel.classList.remove('visibility-visible');
    }

    function moveRightPanel(){
        asideRightPanel.classList.add('visibility-visible');
    }

    function getDate(){
        var time = new Date(),
            day = time.getDate(),
            month = (time.getMonth() + 1),
            year = time.getFullYear();
             if (day < 10)
                {
                    day = "0" + day;
                }
            if (month < 10)
            {
                month = "0" + month;
            }
        leftPanelDate.placeholder = day + "-" + month + "-" + year;
        currentDate = Date(day + "-" + month + "-" + year);
        return currentDate;
    }

    function loadContent(){
        xhRequest.open('GET', urlToContent,true);
        xhRequest.send();
        xhRequest.onreadystatechange = function() {
            if (xhRequest.readyState != 4){
                return;
            }

            if (xhRequest.status != 200) {
                console.log(xhRequest.status + ': ' + xhRequest.statusText);
            } else {
                var parsedContent = JSON.parse(xhRequest.responseText);
                pasteContentToDOM(parsedContent);
            }

        }
    }

    function pasteContentToDOM(parsedContent){
        var i, newTd, text, newBtn;
        for(i=0;i<parsedContent.length;i++){
            var newRow = document.createElement('tr');

            newRow.className = 'tr-hover';
            newRow.id = 'tableRow0'+(i+1);
            tableBody.appendChild(newRow);
            var newRowId = document.getElementById('tableRow0'+(i+1));

            newTd = document.createElement('td');
            newTd.className = 'left-column';
            text = document.createTextNode(parsedContent[i].projectName);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            text = document.createTextNode(parsedContent[i].dueDate);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            text = document.createTextNode(parsedContent[i].created);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            text = document.createTextNode(parsedContent[i].members);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            text = document.createTextNode(parsedContent[i].type);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            text = document.createTextNode(parsedContent[i].status);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            text = document.createTextNode(parsedContent[i].customer);
            newTd.appendChild(text);
            newRowId.appendChild(newTd);

            newTd = document.createElement('td');
            newRowId.appendChild(newTd);

            newBtn = document.createElement('button');
            newBtn.className = 'btn-recycle';
            newRowId.lastChild.appendChild(newBtn);
            newBtn.addEventListener( "click" , removeFromDOM, false)


        }
        checkDueDate();
    }

    function parseDate(arg){
        var tempArr = arg.split('-'),
            savedFirstElement = tempArr[0];

            tempArr[0] = tempArr[1];
            tempArr[1] = savedFirstElement;
        var parsedDate = (tempArr.join('/'));
        return Date.parse(parsedDate);
    }


    function checkDueDate() {
        var allTr = document.querySelectorAll('tbody tr'),
            parsedCurrentDate = Date.parse(getDate()),
            allTrArr = makeArr(allTr);

        for(i=0;i<allTrArr.length;i++)
        {
            var parsedDueDate = parseDate(allTrArr[i].childNodes[1].textContent);
                if(parsedDueDate<parsedCurrentDate){
                    var tableRowId = document.getElementById('tableRow0'+(i+1));
                     tableRowId.style.backgroundColor = '#6f0d0f';
                     tableRowId.firstElementChild.style.backgroundImage = "none";
                }
        }

    }

    function searchText(){
        var str = tableBody.textContent;
        if(searchField.value!=""){
            var charArray = searchField.value.split(""),
                pattern = new RegExp(searchField.value, "gi"),
                match = str.match(pattern);
        }

    }

    function filterByDate(event) {
        debugger;
        var target = event.target,
            allTr = document.querySelectorAll('tbody tr'),
            parsedTargetValue = Date.parse(target.value),
            allTrArr = makeArr(allTr);
        if (target.value != "") {
            for (i = 0; i < allTrArr.length; i++) {
                var parsedDueDate = parseDate(allTrArr[i].childNodes[1].textContent),
                    parsedCreatedDate = parseDate(allTrArr[i].childNodes[2].textContent);
                if ((parsedCreatedDate > parsedTargetValue) || (parsedTargetValue > parsedDueDate)) {
                    tableRowId = document.getElementById('tableRow0' + (i + 1));
                    changedRowsArr.push(tableRowId);
                    tableRowId.style.display = "none";
                }
                // else {
                //
                // }
            }
        } else {
            return;
            // for (var i = 0; i < changedRowsArr.length; i++) {
            //     tableRowId[i].style.display = "";
            // }
        }
    }

    function removeFromDOM(){
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }

    function chooseOption(event){

        var target = event.target;
        if(target.tagName=='P'){
            this.previousSibling.previousElementSibling.value = target.innerText;
            this.style.display = "none";
        }
    }


    function closePseudoSelects(){
        for(var i=0; i<pseudoSelect.length; i++){
            if(pseudoSelect[i].style.display!="none"){
                pseudoSelect[i].style.display="none"
            }
        }
    }

    function showPseudoSelect(event){

        closePseudoSelects();
        var target = event.target;
        this.parentElement.style.display="block";
    }

    function addToTable(event) {
        event.preventDefault();
        alert("А тут маленькі звірятка добавляють дані в таблицю. ))))");
    }

    //******************************************************************************************************************
}