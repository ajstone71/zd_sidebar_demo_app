// Global variable declaration 
let client = ZAFClient.init();
let zendeskId;
let zendeskTicketObj;
let linkedIssueDataEdit = {};
let linkedIssueDataComment = {};
let solutions;
let csrfToken = "9nWKnD4_KpNgY_2rMs";
let guid = client._instanceGuid;
let workflow_mule = 'https://75c61db2-c6be-4081-bb8e-2be2977e4461.trayapp.io';
let default_user = "7ea07c40-5714-11e9-8746-b3b4895a1b3a";


/*------------------------------------*/
/* ### GET USER DATA  ### */
/*------------------------------------*/

let loadingAllsolutions = document.getElementById("loading-linked-issues");
let wrapper = document.getElementById("wrapper");

// Get user information

let ticket_id = client.get('ticket').then(ticket => {
    console.log("ticket_id: "+ticket.id);
});


var current_user = client.get("currentUser").then(user => {
    console.log("user: "+user.currentUser.externalId);
    return user.currentUser;
}).then(currentUser => {
    if (currentUser.role === 'admin') {
        loadAllLinkedSolutions(currentUser);
    } else {
        client.invoke('notify', "You are not authorized to view these resources, please contact your administrator for more information", "error")
    }
    return currentUser;
});



/*-------------------------------*/
/* ### Change color on click ### */
/*-------------------------------*/

highlight = (element, index) => {
    let item = element[index]
    let orig = item.style.color;
    item.style.color = '#ffb229';
    setTimeout(function() {
        item.style.color = orig;
    }, 150);
 }
/*-----------------------------*/
/* ###  Open Config Modal  ### */
/*-----------------------------*/

function openConfigModal(config_url) {
    console.log("url received")
    client.invoke('instances.create', {
        location: 'modal',
        url: config_url,
        size: {
            width: '30vw',
            height: '75vh'
        } 
    }).then(modal_context => {
        var modal_client = client.instance(modal_context['instances.create'][0].instanceGuid);
        window.addEventListener("message", this.handleIframeEvents);
    })
}

function handleIframEvents(e) {
    console.log(e.data.type+' event received');
    switch (e.data.type) {
        case 'tray.configPopup.finish':
        console.log('finish');
        closeConfigModal();
        break;
        case 'tray.configPopup.error':
        console.log('error');
        break
        case 'tray.configPopup.cancel':
        console.log('cancel');
        closeConfigModal();
        break;
    }
}


/*----------------------------*/
/* ### Close Config Modal ### */
/*----------------------------*/

function closeConfigModal() {
    modal_client.invoke('destroy');
}

/*----------------------------*/
/* ### Configure Solution ### */
/*----------------------------*/

async function configureSolution(solution_id) {
    console.log("configure button clicked");
    console.log(solution_id);
    let response = await fetch(workflow_mule+'/initiate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': "9nWKnD4_KpNgY_2rMs"
        },
        body: JSON.stringify({
            "default_user": "7ea07c40-5714-11e9-8746-b3b4895a1b3a",
            "solution": solution_id
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            client.invoke('notify', "There was an error generating your config wizard, please try again.", "error")
        return;
        }
    }).then(response_body => {
        openConfigModal(response_body.url);
        return;
    })
}

/*---------------------------------*/
/* ### LOAD ALL LINKED ISSUES  ### */
/*---------------------------------*/

let solutionsLengthElement = document.getElementById("linked-solutions-length");
let innerAllsolutionsElement = document.getElementById("inner-all-linked-solutions");

// Loads all linked solutions that can be configured on app load
loadAllLinkedSolutions = async (user_info) => {
    console.log("loading solutions");
    let response = await fetch(workflow_mule+'/solutions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': "9nWKnD4_KpNgY_2rMs"
        },
        body: JSON.stringify({
             "default_user": default_user,
             "current_user": current_user.externalId
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
        solutionsLengthElement.innerHTML = "0"
        console.log("no solutions found")
        client.invoke('notify', "Unable to return your solutions", "error")
        return response.json();
        }
    }).then(response => {
        solutions = response.solutions
        console.log("solutions returned");
        let html = []
        // Set linked issues
        let solutionsLength = solutions.length;
        solutionsLengthElement.innerHTML = solutionsLength;
        solutionsHTML = [];
        // Push each issue HTML to array
        solutions.forEach(function(obj) {
            solutionsHTML.push(obj);
        });
        // Join contents of solutionsHTML
        let result = solutionsHTML.join("\n");
        // Append to DOM
        innerAllsolutionsElement.innerHTML = result;
        console.log("solutions appened");
        // Add click events to .tray--solution-tile-reconfigure 
        let expandLinkedIssue = document.querySelectorAll(".tray--solution-tile-controls");
        expandLinkedIssue.forEach(async function (element, index){
            let value = element.getAttribute('value');
            element.addEventListener('click', async function(e) {
                highlight(expandLinkedIssue, index)
                configureSolution(e.srcElement.value);
            })
        });  
        console.log("event listeners added to config buttons");
        return true;
    }).catch(error => {
        console.error(error);
    });
}



// Add event listener to create issue button
let createIssueButton = document.getElementById("load-solutions")
createIssueButton.addEventListener("click", loadAllLinkedSolutions);




