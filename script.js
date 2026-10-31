// const { createElement } = require("react");

const businessAds = [{
    name:"sheamous Fashion",
    contact: "+2348081950306",
    image :"images/first.jpg"
},
{
     name:"Simnom Style",
    contact: "+2348081950306",
    image :"images/second.jpg"
},
{
     name:"Standard Taste",
    contact: "+2348081950306",
    image :"images/third.jpg"

}]



function displayBusiness(index){
    if(!document.getElementById("business-name")){
        return
    }
    let currentBusiness = businessAds[index]
    document.getElementById("business-name").textContent = currentBusiness.name;
    document.getElementById("business-contact").textContent = currentBusiness.contact;
    document.getElementById("product-image").src = currentBusiness.image
    document.querySelector(".product-slide").style.setProperty("--advert-image", `url("${currentBusiness.image}")`);
}

let currentIndex = 0;

setInterval(function(){
    currentIndex++
    if(currentIndex >= businessAds.length){
        currentIndex = 0
    }
    displayBusiness(currentIndex)
},5000)


const menuBtn = document.querySelector(".menu-toggle");
const navBar = document.querySelector(".nav-links");
const menuIcon = document.querySelector("i")

menuBtn.addEventListener('click',function(){
    navBar.classList.toggle("active")
    if(navBar.classList.contains("active")){
        menuIcon.classList.replace("fa-bars" , "fa-xmark")
    }else{
        menuIcon.classList.replace("fa-xmark" , "fa-bars")
    }
})

const opportunities = document.getElementById("opportunities-list");
const errorMessage = document.getElementById("error-message");
const loadingMessage = document.getElementById("loading-message");
const loadMore = document.getElementById("load-more-btn")
const categorySelector = document.getElementById("opp-category")
let nextCursor = null;
let isLoading = false;

let allJobs = [];

if(loadMore){
    loadMore.addEventListener('click',function(){
    getJobs()
})

}

async function getJobs() {
    if(isLoading)return
    if(nextCursor === null){
        opportunities.innerHTML = "";
    }
    isLoading = true;
    loadingMessage.textContent = "Loading...please wait"
    errorMessage.textContent = ""
    try{
        let url = "https://jobs.peopleseek.ai/api/v1/jobs?work_arrangement=remote&eligible_country=NG&limit=5"
        if(nextCursor !== null){
            url += `&cursor=${nextCursor}`;
        }
        const response = await fetch(url)
        if(!response.ok){
            throw new Error("unabel to load file")
        }
        const data = await response.json()
        console.log(data.data)
     
        const jobs = data.data.jobs
        allJobs.push(...jobs)

        nextCursor = data.meta.next_cursor

        loadingMessage.textContent = ""
        

        jobs.forEach(function(job){

        const card = document.createElement("div")

        card.classList.add("job-card")

        let applyButton = ""

        if(job.applyUrl){
            applyButton = `<a href =" ${job.applyUrl}" target = "_blank" rel="noopener noreferrer">Apply Now</a>`
        }

         
        card.innerHTML = `
             <h3>${job.title}</h3>

             <p>
             <i class="fa-solid fa-building"></i>
             ${job.company.name}
             </p>

              <p>
             ${job.summary || "No description available"}
             </p>

             <p>
             <i class="fa-solid fa-briefcase"></i>
             ${job.employmentType || "Not specified"}
             </p>
            

              <p>
             <i class="fa-solid fa-location-dot"></i>
             ${job.workArrangement || "Not specified"}
             </p>
            
              <p>
             posted:${job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "date unavailable"}
             </p>
             <div class="apply-btn">
             <a href =" ${job.url}" target = "_blank" rel="noopener noreferrer" class="opp-btn">view oppportunities</a>
              ${applyButton}
             </div>
             
        `;
        opportunities.appendChild(card)
          
     })
    }
    catch(error){
       errorMessage.textContent = "unable to load data,check internet connection and try again"
    }
    finally{
        isLoading = false
    }
   
    loadingMessage.textContent = "";

    
}
if(opportunities){
  getJobs()
}


const searchInput = document.getElementById("opportunity-keyword");
const searchBtn = document.getElementById("search-btn");
const filterMessage = document.getElementById("filter-message")

if(searchBtn){


searchBtn.addEventListener('click',function(){
     
    opportunities.innerHTML = ""
    filterMessage.textContent = ""

    let keyWord = searchInput.value.trim()
   const filtered = allJobs.filter(function(job){
  
    if(job.title.toLowerCase().includes(keyWord.toLowerCase()) || job.company.name.toLowerCase().includes(keyWord.toLowerCase())){
        
    return job
    }

    })

    if(filtered.length === 0){
        filterMessage.textContent = "no matching oppotunities found"

    }else{
         
        filtered.forEach(function(job){
           const card = document.createElement("div");
           card.classList.add("job-card")

            card.innerHTML = `
             <h3>${job.title}</h3>

             <p>
             <i class="fa-solid fa-building"></i>
             ${job.company.name}
             </p>

              <p>
             ${job.summary || "No description available"}
             </p>

             <p>
             <i class="fa-solid fa-briefcase"></i>
             ${job.employmentType || "Not specified"}
             </p>
            

              <p>
             <i class="fa-solid fa-location-dot"></i>
             ${job.workArrangement || "Not specified"}
             </p>
            
              <p>
             posted:${job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "date unavailable"}
             </p>
             <div class="apply-btn">
             <a href="${job.url}" target = "_blank" rel="noopener noreferrer" class="opp-btn">view oppportunities</a>
              ${applyButton}
             </div>
             
             `
            opportunities.appendChild(card)
        })
    }
});
}


function displayJobs() {
console.log("ruuning")
    opportunities.innerHTML = "";
    filterMessage.textContent = "";
     let keyWord = searchInput.value.trim().toLowerCase();
    let selectCategory = categorySelector.value

    const savedOpportunities = JSON.parse(localStorage.getItem("opportunities")) || [];
const approvedOpportunities = savedOpportunities.filter(function(opportunity){
    return opportunity.status === "approved"
})

let filteredApproved = approvedOpportunities.filter(function(opportunity){

    let matchesKeyword = opportunity.title.toLowerCase().includes(keyWord) ||
                         opportunity.organization.toLowerCase().includes(keyWord);

    let matchesCategory = selectCategory === "all" ||
                          opportunity.category.toLowerCase() === selectCategory;

    return matchesKeyword && matchesCategory;
});
console.log("Selected category:", selectCategory);
console.log("Approved opportunities:", approvedOpportunities);
console.log("Filtered approved:", filteredApproved);

    let filtered = allJobs.filter(function(job) {

        let matchesKeyword = job.title.toLowerCase().includes(keyWord) ||
                           (job.company?.name || "").toLowerCase().includes(keyWord);

        let matchesCategory = selectCategory === "all" ||
        selectCategory === "jobs"

        loadMore.style.display = selectCategory === "all" ||
        selectCategory === "jobs"
             ? "block":
                "none"

        // if(selectCategory === "all" || selectCategory === "jobs" ){
        //     loadMore.style.display = "block"
        // }else{
        //     loadMore.style.display = "none"
        // }

        return matchesKeyword && matchesCategory

    });

    filtered.forEach(function(job) {

        const card = document.createElement("div");

        card.classList.add("job-card");
 
        let applyButton = "";

        if (job.applyUrl) {
            applyButton = `<a href="${job.applyUrl}" target="_blank" rel="noopener noreferrer">Apply Now</a>`;
        }

        card.innerHTML = `
            <h3>${job.title}</h3>

            <p>
                <i class="fa-solid fa-building"></i>
                ${job.company?.name || "Company not specified"}
            </p>

            <p>
                ${job.summary || "No description available"}
            </p>

            <p>
                <i class="fa-solid fa-briefcase"></i>
                ${job.employmentType || "Not specified"}
            </p>

            <p>
                <i class="fa-solid fa-location-dot"></i>
                ${job.workArrangement || "Not specified"}
            </p>

            <p>
                Posted: ${job.postedAt
                    ? new Date(job.postedAt).toLocaleDateString()
                    : "Date unavailable"}
            </p>

            <div class="apply-btn">
                <a href="${job.url}" target="_blank"
                   rel="noopener noreferrer" class="opp-btn">
                   View Opportunities
                </a>
                ${applyButton}
            </div>
        `;

       

        opportunities.appendChild(card);

    });

     filteredApproved.forEach(function(opportunity){
            const card = document.createElement("div")
         card.classList.add ("job-card")

         card.innerHTML = `
        <h3> ${opportunity.title}</h3>

           <p>
           <i class="fa-solid fa-building"></i>
           ${opportunity.organization}
           </p>

          <p>
          <i class="fa-solid fa-location-dot"></i> 
          ${opportunity.location}
          </p>

           <p>${opportunity.description}</p>

          <a href = "${opportunity.link}" target="_blank"
          rel="noopener noreferrer" class=opp-btn>
          View Opportunity
          </a>
          `;
        opportunities.appendChild(card)

        })

}
if(opportunities){

  categorySelector.addEventListener("change",displayJobs)

  displayJobs()
} 



// ==========POST AN OPPORTUNITY PAGE==========

const opportunityForm = document.getElementById("opportunity-form");
const formMessage = document.getElementById("form-message");
const opportunityTitle = document.getElementById("opportunity-title");
const organization = document.getElementById("organization");
const opportunityLocation = document.getElementById("opportunity-location");
const opportunityDescription = document.getElementById("opportunity-description");
const opportunityLink = document.getElementById("application-link");
const categorySelection = document.getElementById("opportunity-category");

if(opportunityForm){
    
    opportunityForm.addEventListener('submit',function(event){
        event.preventDefault()
        console.log("submitted")

        let title = opportunityTitle.value;
        let organizationName = organization.value;
        let location = opportunityLocation.value;
        let description = opportunityDescription.value;
        let link = opportunityLink.value;
        let category = categorySelection.value

        let newOpportunity = {
            title: title,
            organization: organizationName,
            location: location,
            description: description,
            link: link,
            category: category,
            status: "pending"
        }

        const existingOpportunity = JSON.parse(localStorage.getItem("opportunities")) || []
        existingOpportunity.push(newOpportunity)

        localStorage.setItem("opportunities",JSON.stringify(existingOpportunity));

        opportunityTitle.value = ""
        organization.value = ""
        opportunityLocation.value = ""
        opportunityDescription.value = ""
         opportunityLink.value = ""
         categorySelection.value = ""

        formMessage.textContent = "Form submited successfully"
    })
}
