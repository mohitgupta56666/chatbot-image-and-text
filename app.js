let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imageBtn = document.querySelector("#image")
let inputImage = document.querySelector("#image input");
let submitBtn = document.querySelector("#submit");

const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAVFJU5y_BIZ911ajm1B4iMbwoCNAbUqDw"

let user ={
    message: null ,
    file: {
        mime_type: null,
        data: null
    } //imageBtn.innerHTML = `${user.file.data? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="choosing"/>`: ""}`;
}

async function generateResponse(aiChatBox) {

    let text = aiChatBox.querySelector(".ai-chat-area");
    let RequestOption={
        method:"POST",
        header:{'Content-Type': 'application/json'},
        body:JSON.stringify({
    "contents": [
      {
        "parts": [
          {
            "text": user.message
          },
          (user.file.data? [{"inline_data": user.file}]: []) 
        ]
      }
    ]
  })
    }

    try {
        let response = await fetch(api_url, RequestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/(\*\*|\*)(.*?)\1/g, "$2").trim();
        text.innerHTML = apiResponse;
        //console.log(apiResponse)
    } catch(e) {
        console.log(e);
    }
    chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior: "smooth"})
    imageBtn.innerHTML = `<i class="fa-solid fa-image"></i> 
         <input type="file" accept="images/*" hidden>`;
    user.file = {};

    
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML= html
    div.classList.add(classes);
    return div;
}

function handleChatResponse ( message ) {
    user.message = message
    let html = `<img src="user-image.png" alt="" id="user-image" width = "10%">
    <div class="user-chat-area">${user.message}
    ${user.file.data? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="choosing"/>`: ""}
    </div>`;
    prompt.value=""
    let userChatBox = createChatBox(html, "user-chat-box"); 
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior: "smooth"})

    setTimeout(()=> {
        let html = `<img src="ai-image.webp" alt="" id="ai-image" width = "10%">
        <div class="ai-chat-area"> <img src="loading.png" alt="Loading" width="150px" id="load"> </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
        
    },600)
    
}
prompt.addEventListener("keydown", (e)=> {
    if(e.key == "Enter") {
        handleChatResponse(prompt.value);
    }
})

submitBtn.addEventListener("click", ()=> {
    handleChatResponse(prompt.value);
})

inputImage.addEventListener("change", ()=> {
    const file = inputImage.files[0]
    if(!file) return

    let reader = new FileReader()
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type :file.type,
            data : base64string
        }
        imageBtn.innerHTML = `${user.file.data? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="ImageAtBtn"/>`: ""}`;
        
    }

    
    reader.readAsDataURL(file);

})

imageBtn.addEventListener("click", ()=> {
    imageBtn.querySelector("input").click();
})