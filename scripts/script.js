window.onload = function() {
    var asideLeftPanel = document.getElementById('asideLeftPanel'),
        asideRightPanel = document.getElementById('asideRightPanel'),
        myTable = document.getElementById('tableData'),
        allTh = document.querySelectorAll('thead th'),
        btnPlus = document.getElementById('btnPlus'),
        leftPanelDate = document.getElementById('leftPanelDate'),
        getDate = getDate(),
        tableBody = document.getElementById('tableBody'),
        xhRequest = new XMLHttpRequest,
        urlToContent = 'json/content.json',
        contentToDOM = loadContent(),
        sortingOrderFlag = "",
        btnLeftPanel = document.getElementById('btnLeftPanel');

        /**add Listeners*/
        for (var i = 0; i < allTh.length - 1; i++) {
            allTh[i].addEventListener("click", sortTable, false);
        }
            btnLeftPanel.addEventListener("click", moveLeftPanel, false);
            btnPlus.addEventListener("click", moveRightPanel, false);
            tableBody.addEventListener("click", closeRightPanel, false);
        //*******************
            function makeArr(nodeList) {
                var arr = [];
                //alert('makeArr:' +nodeList.length);
                for (var i = 0; i < nodeList.length; i++) {
                    arr.push(nodeList[i]);
                }
                return arr;
            }

            function sortTable(event) {
                var allTr = document.querySelectorAll('tbody tr');
                var target = event.target,
                    allThArr = makeArr(allTh),
                    allTrArr = makeArr(allTr),
                    indexOfFirstTarget = allThArr.indexOf(target),
                    documentFragment = document.createDocumentFragment(),
                    order = (sortingOrderFlag === "" || sortingOrderFlag === "descending") ? "ascending" : "descending";

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
                    myTable.querySelector("tbody").appendChild(documentFragment);
            }

    //******************************************************************************************************************

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


        }
       // checkDueDate();
    }

    function checkDueDate() {
        var allTrs = document.querySelectorAll('tbody tr'),
            dueDateArr=[];
        for(i=0;i<allTrs.length;i++)
        {
            (allTrs[i].childNodes[1].textContent);
        }

    }
    //******************************************************************************************************************
}