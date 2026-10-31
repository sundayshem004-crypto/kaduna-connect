 const totalCount = document.getElementById("total-count");
 const pendingCount = document.getElementById("pending-count");
 const approvedCount = document.getElementById("approved-count");
 const rejectedCount = document.getElementById("rejected-count");
 const pendingList = document.getElementById("pending-list");

 let pendingOpportunities = []
 let updatedCount = []
 

 function displayPending(){

     pendingList.innerHTML = "";

    pendingOpportunities.forEach(function(opportunity){

        let card = document.createElement("div")
         card.classList.add ("pending-card")

         card.innerHTML = `
        <h3> ${opportunity.title}</h3>

           <p>${opportunity.organization}</p>

          <p> ${opportunity.location}</p>

           <p>${opportunity.description}</p>

          <p> ${opportunity.link}</p>

          <button class="approve-btn">Approve</button>
          <button class="reject-btn">Reject</button>

         `;

           pendingList.appendChild(card)

           
    const approveBtn = card.querySelector(".approve-btn");
    const rejectBtn = card.querySelector(".reject-btn");

    approveBtn.addEventListener('click',function(){

        opportunity.status = "approved"
        localStorage.setItem("opportunities", JSON.stringify(updatedCount))
         updateDashboard()
    })

    rejectBtn.addEventListener('click',function(){

        opportunity.status = "rejected"
        localStorage.setItem("opportunities", JSON.stringify(updatedCount))
         updateDashboard()
    })
   

    });
 }

 function updateDashboard(){

      updatedCount = JSON.parse(localStorage.getItem("opportunities")) || []

      totalCount.textContent  =   updatedCount.length
    

      pendingCount.textContent = updatedCount.filter(function(opportunity){
        return opportunity.status === "pending"
    }).length;

    approvedCount.textContent = updatedCount.filter(function(opportunity){
        return opportunity.status === "approved"
    }).length;

    rejectedCount.textContent = updatedCount.filter(function(opportunity){
        return opportunity.status === "rejected"
    }).length

     pendingOpportunities = updatedCount.filter(function(opportunity){
        return opportunity.status === "pending"
    })
    displayPending()
    
 }
 updateDashboard();

 
 
 
    
       