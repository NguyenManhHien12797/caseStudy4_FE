
function getPosts(posts){

    return `<div class="status-field-container write-post-container">`+
            `<div class="user-profile-box">`+
            `<div class="user-profile">`+
                `<img src="/images/profile-pic.png" alt="">`+
                    `<div>`+
                        `<input type="submit" onclick="showProfile(${posts.appUsers.id})" id="users_name" class="users_name" value="${posts.appUsers.userName}">`+
                       ` <small>${posts.postTime}</small>`+
                       ` <small>-:-</small>`+
                       ` <small>${posts.accessModifier.name}</small>`+
                   ` </div>`+
           ` </div>`+
          `  <div>`+
               ` <div class="user-profile-action"><i class="fas fa-ellipsis-v"></i>`+
                     `<div class="delete-post " id="delete-post">`+
                      `<button class="comment-user-contain-delete-btn" onclick="deletePost(${posts.id})">Xóa bài đăng</button>`+
                      `<button class="comment-user-contain-update-btn comment-user-contain-delete-btn showFormUpdate" id="${posts.id}" onclick="showFormUpdate(${posts.id})">Sửa bài đăng</button>`+
                         `</div>`+
                `</div>`+

          `  </div>`+
        `</div>`+
        `<div class="status-field">`+
            `<p>${posts.content} </p>`+
           ` <img src="/images/${posts.img}" alt="">`+
       ` </div>`+
       ` <div class="post-reaction">`+
           ` <div class="activity-icons">`+
               ` <div><img src="/images/like-blue.png" alt="">120</div>`+
                `<div onclick="listComments(${posts.id})"><img src="/images/comments.png" alt="">52</div>`+
               ` <div><img src="/images/share.png" alt="">35</div>`+
            `</div>`+
           ` <div class="post-profile-picture">`+
               ` <img src="/images/profile-pic.png " alt=""> <i class=" fas fa-caret-down"></i>`+
           ` </div>`+
       ` </div>`+
       ` <div class="status-comment">`+
            `<div class="comment-user">`+
               ` <img src="/images/profile-pic.png" alt="" class="comment-user__avt">`+
            `</div>`+
            `<input type="text" placeholder="Viết bình luận" id="status-comment${posts.id}" onkeydown="keydownHandler(event,${posts.id})"> `+
            // ` <button onclick="addComment(${posts.id})">add</button>`+
        `</div>`+
        `<div class="status-comment-list" id="cmt+${posts.id}">`+
       ` </div>`+
   ` </div>`;
}


function listPosts(){
    let token = localStorage.getItem("token");
    let d = localStorage.getItem("data")

    $.ajax({
        type:"GET",
        headers:{
            'Accept':'application/json'
        },
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        // Authorization: "Bearer "+token,
        url:"http://localhost:8080/posts",
        success:function (data){
            let ct= "";
            console.log(data);

            if(data==null){
                document.getElementById('post_ct').innerHTML = ct;
            }
            else {
                for(let i=0; i<data.length; i++){
                    ct += getPosts(data[i]);
                }

                document.getElementById('post_ct').innerHTML = ct;
            }

        }
    })

}

listPosts();

function listComments(id){
    let token = localStorage.getItem("token");

    $.ajax({
        type: "GET",
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url: "http://localhost:8080/api/comments/post/"+id,
        success:function (data){
            console.log(data)
            let ct = ""
            for(let i=0; i<data.length; i++){
                ct +=`<div class="">`+
                    ` <div class="comment-user comment-user-contain">`+
                    `<img src="/images/profile-pic.png" alt="" class="comment-user__avt">`+
                    `<div class="comment-user-ct comment-user-ct${data[i].id}" id="comment-user-ct${data[i].id}">`+
                    ` <span class="comment-user__name">${data[i].appUsers.userName}</span>`+
                    `<span class="comment-user-content">${data[i].cmtContent}</span>`+
                    ` </div>`+
                    `<div class="comment-user-contain-show">`+
                    `<button class="comment-user-contain-show-btn" >...</button>`+
                    `<div class="comment-user-contain-delete">`+
                    `<button class="comment-user-contain-delete-btn" onclick="deleteComment(${data[i].id}, ${id})">Xóa bình luận</button>`+
                    `<button class="comment-user-contain-update-btn comment-user-contain-delete-btn" onclick="showFormUpdateComent(${data[i].id},${id},'${data[i].cmtContent}')" >Sửa bình luận</button>`+
                    `</div>`+
                    `</div>`+
                    ` </div>`+
                    ` </div>`
            }

            document.getElementById(`cmt+${id}`).innerHTML= ct;
        }
    })

}


function showFormUpdateComent(id, post_id,content){
    let str =  `<input type="text" placeholder="Viết bình luận" class="comment-user-ct comment-update" id="status-comment-update${id}${post_id}" value="${content}" onkeydown="updateKeyHandler(event,${id},${post_id})">`
    document.getElementById(`comment-user-ct${id}`).innerHTML=str;


}

function updateComment(id,post_id){
    let token = localStorage.getItem("token");
    let da = JSON.parse(localStorage.getItem("data"))
    let postId = post_id;
    let content= $(`#status-comment-update${id}${post_id}`).val();
    let appUser_id=da.id;
    let cmt= {
        appUsers:{
            id:appUser_id
        },
        posts:{
            id:postId
        },
        cmtContent:content
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        type:"PUT",
        data:JSON.stringify(cmt),
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url:`http://localhost:8080/api/comments/${id}`,
        success:function (data){
            listComments(post_id)
            console.log(data)
            $(`#status-comment-update${id}${post_id}`).val("");
        }

    })
}

function keydownHandler(evt,post_id){
    if(evt.keyCode==13){
        console.log("onkeydown")
        addComment(post_id);
    }
}

function updateKeyHandler(evt,id,post_id){
    if(evt.keyCode==13){
        updateComment(id,post_id)
    }
}

function addComment(post_id){
    let token = localStorage.getItem("token");
    let da = JSON.parse(localStorage.getItem("data"))
    let postId = post_id;
    let content=$(`#status-comment${post_id}`).val() ;
    let appUser_id=da.id;
    let cmt= {
        appUsers:{
            id:appUser_id
        },
        posts:{
            id:postId
        },
        cmtContent:content
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        type:"POST",
        data:JSON.stringify(cmt),
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url:"http://localhost:8080/api/comments",
        success:function (data){
            listComments(post_id)
            $(`#status-comment${post_id}`).val("")
        }

    })
}



function deleteComment(id,post_id){
    let token = localStorage.getItem("token");
    $.ajax({
        type:"DELETE",
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url:`http://localhost:8080/api/comments/${id}`,
        success:function (){
            listComments(post_id)
        }
    })
}

function inputvalTextarea(){
    $(".post-upload-textarea-plc").val($('.create-stt-input').text())
}

// showprofile
function showProfile(username){
    let dat = JSON.parse(localStorage.getItem("data"))
        console.log("Hello"+username);
        $.ajax({
            type:"GET",
            beforeSend:function (xhr){
                xhr.setRequestHeader("Authorization","Bearer "+ dat.token);
            },
            url: "http://localhost:8080/api/users/profile/"+username,
            success:function (data){

            }

        })
        // $('.container').load("profileshort.html")
}
// showprofile
$(document).ready(function (){
    let dat = JSON.parse(localStorage.getItem("data"))

    if(dat==null|| dat==""){
        console.log("dang nhap di")
        location.href="index.html"
    }


    // profile




    $('.logo').click(function (){
        location.href="home.html"
    })
    // profile

    // logout

    $('.settings-links').click(function (){
        localStorage.clear();
        location.href="index.html";
    })

    // logout

    $(".user-profile-name").text(`${dat.username}`)
    $(".post-upload-textarea-plc").attr("placeholder",`What is on your mind, ${dat.username} ?`)

    $(".container__create-title_btn ").click(function () {
        $(".form__input-input-create").hide();

        $("#myimage").attr("src","");
        // $(".create-stt-input").val(" ");
            $('.create-stt-input').text("")
            $('.create-stt-input').attr("contenteditable","true")

        $('.post-upload-textarea-plc').val("")
        let $element = $('.post-upload-textarea-plc');
        if ($element.html().length && !$element.text().trim().length) {
            $element.empty();
        }

    });


    $(".modal__overlay").click(function () {
        $(".form__input-input-create").hide();
        $("#myimage").attr("src","");
        // $(".create-stt-input").val(" ");
            $('.create-stt-input').text(" ")
            $('.create-stt-input').attr("contenteditable","true")

        $('.post-upload-textarea-plc').val("")
        let $element = $('.post-upload-textarea-plc');
        if ($element.html().length && !$element.text().trim().length) {
            $element.empty();
        }

    });

    // add post
    $('.submit').click(function (){
        addPost()
        $('.create-stt-input').text("")
        $('.post-upload-textarea-plc').val("")
        let $element = $('.post-upload-textarea-plc');
        if ($element.html().length && !$element.text().trim().length) {
            $element.empty();
        }

        $('.create-stt-input').attr("contenteditable","true")
        $("#myimage").attr("src","");
    })

    $( '#formUploadFile' ).submit(function ( e ) {


        let token = localStorage.getItem("token");
        e.preventDefault();
        $.ajax({
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false,
            cache:false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            url: "http://localhost:8080/uploadFile",

            success: function (data) {
            }
        });
        e.preventDefault();

        $(".form__input-input-create").hide();
    });


    // add post


        $(".post-upload-textarea").click(function () {



            // div placeholder
            $("[contenteditable]").focus(function(){
                var $element = $(this);
                if ($element.html().length && !$element.text().trim().length) {
                    $element.empty();
                }
            });
            // div placeholder

            $(".form__input-input-create").show();
            $('.avatar-name').text(`${dat.username}`);

        });


})




function showFormUpdate(id){
    let token = localStorage.getItem("token");
    let dat = JSON.parse(localStorage.getItem("data"))
    $.ajax({

        type: "GET",
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url: "http://localhost:8080/posts/"+id,
        success:function (data){
            console.log("day la data post")
            console.log(data)
            console.log("day la data post")
            console.log(data.img)
            $(".form__input-input-create").show();
            $('.avatar-name').text(`${dat.username}`);
            $('.container__create-title_name').text(`Sửa bài viết`).attr("style","padding-right: 120px");
            let ct = `    <form  encType="multipart/form-data" id="formUploadFile" class="container__create-form">`+
            `        <div class="container__avatar container__avatar-form">`+
            `            <div class="avatar-img container__avatar-form-img">`+
            `                <img src="/images/profile-pic.png" alt="">`+
            `            </div>`+
            `            <div>`+
            `                <span class="avatar-name container__avatar-form-name">${dat.username}</span>`+
            `                <select class="container__avatar-form-select">`+
            `                    <option value="1">Công khai</option>`+
            `                    <option value="2">Bạn bè</option>`+
            `                    <option value="3">Chỉ mình tôi</option>`+
            `                </select>`+
            `            </div>`+
            `        </div>`+
            `        <div class="container__create-stt-input">`+
            `        <div contentEditable="true" class=" create-stt-input"`+
            `             data-placeholder="Bạn đang nghĩ gì thế?"><br>`+
            `             ${data.content}`+
            `        </div>`+
                `            <img id="myimage" src="/images/${data.img}">`+
            `        </div>`+
            `        <div class="container__create-img container__create-img-img-img">`+
            `            <img class="container__create-img__src" src="" alt="">`+
            `                <label For="file" class="container__create-img-input">`+
            `                    <div class="container__create-img-span">`+
            `                        <span class="container__create-img-name">Thêm vào bài viết của bạn</span>`+
            `                        <span class="container__create-img-icon"><i`+
            `                            class="fa-solid fa-image"></i></span>`+
            `                    </div>`+
           `                 </label>`+
           `                 <input id="file" hidden type="file" name="File" onchange="changeHandler(event)"/>`+
           `         </div>`+
           `         <input type="submit" onclick="updatePost(${data.id})" class="form__input-input-hide form__input-input-hide__input submit"`+
           `                value="Đăng">`+
           `             <input type="hidden" class="post-update-id">`+
           `     </form>`;
            document.getElementById(`showUpdate`).innerHTML= ct;
            $('.submit').click(function (){
                $(".form__input-input-create").hide();
            })
        }

    })

}



function changeHandler(evt){
    evt.stopPropagation();
    evt.preventDefault();

    // FileList object.
    var files = evt.target.files;

    var file = files[0];
    localStorage.setItem("img",file.name)

    var fileReader = new FileReader();


    fileReader.onload = function(progressEvent) {
        var url = fileReader.result;

        var myImg = document.getElementById("myimage");
        myImg.src= url;
    }


    // Read file asynchronously.
    fileReader.readAsDataURL(file); // fileReader.result -> URL.

}




function addPost(){

    let token = localStorage.getItem("token");
    let da = JSON.parse(localStorage.getItem("data"));
    let ct=$('.create-stt-input').text();
    console.log(ct)
    let appUser_id=da.id;
    let image=localStorage.getItem("img");
    let accessModifier= $('.container__avatar-form-select').val();
    console.log(accessModifier)
    console.log(accessModifier)
    let post={
        content:ct,
        img:image,
        postTime: new Date(),
        accessModifier:{
            id:accessModifier
        },
        appUsers:{
            id:appUser_id
        }
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        type:"POST",
        data:JSON.stringify(post),
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url:"http://localhost:8080/posts",
        success:function (data){
            console.log("da dang post")
            listPosts();

            localStorage.removeItem("img")
        }

    })
}

function updatePost(id){

    let token = localStorage.getItem("token");
    let da = JSON.parse(localStorage.getItem("data"));
    let ct=$('.create-stt-input').text();
    let appUser_id=da.id;
    let image=localStorage.getItem("img");
    let accessModifier= $('.container__avatar-form-select').val();
    let post={
        content:ct,
        img:image,
        postTime: new Date(),
        accessModifier:{
            id:accessModifier
        },
        appUsers:{
            id:appUser_id
        }
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        type:"PUT",
        data:JSON.stringify(post),
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url:`http://localhost:8080/posts/${id}`,
        success:function (data){
            console.log("da dang post")
            listPosts();

            localStorage.removeItem("img")
        }

    })
}


function deletePost(id){
    let token = localStorage.getItem("token");
    $.ajax({
        type:"DELETE",
        beforeSend:function (xhr){
            xhr.setRequestHeader("Authorization","Bearer "+ token);
        },
        url:`http://localhost:8080/posts/${id}`,
        success:function (){
           listPosts()
        }
    })
}


