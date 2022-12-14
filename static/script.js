        function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

        function post() {
            let comment = $("#textarea-post").val()
            let today = new Date().toISOString()
            let img = $('#post_img')[0].files[0]

            let form_data = new FormData()
            form_data.append("comment_give", comment)
            form_data.append("date_give", today)
            form_data.append("img_give", img)

            $.ajax({
                type: "POST",
                url: "/posting",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response["result"] == "success") {
                    $("#modal-post").removeClass("is-active")
                        alert(response["msg"])
                        window.location.reload()
                    }
                }
            })
        }

        function time2str(date) {
            let today = new Date()
            let time = (today - date) / 1000 / 60  // ???

            if (time < 60) {
                return parseInt(time) + "??? ???"
            }
            time = time / 60  // ??????
            if (time < 24) {
                return parseInt(time) + "?????? ???"
            }
            time = time / 24
            if (time < 7) {
                return parseInt(time) + "??? ???"
            }
            return `${date.getFullYear()}??? ${date.getMonth() + 1}??? ${date.getDate()}???`
        }

        function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

        function get_posts(username) {
            if (username == undefined){
                username = ""
            }
            $("#post-box").empty()
            $.ajax({
                type: "GET",
                url: `/get_posts?username_give=${username}`,
                data: {},
                success: function (response) {
                    if (response["result"] == "success") {
                        let posts = response["posts"]
                        for (let i = 0; i < posts.length; i++) {
                            let post = posts[i]
                            let time_post = new Date(post["date"])
                            let time_before = time2str(time_post)
                            let img = posts[i]['file']
                            // {#let class_heart = ""#}
                            // {#    if (post["heart_by_me"]) {#}
                            // {#        class_heart = "fa-heart"#}
                            // {#    } else {#}
                            // {#        class_heart = "fa-heart-o"#}
                            // {#    }#}
                            // ?????? ?????????
                                let class_heart = post['heart_by_me'] ? "fa-heart": "fa-heart-o"
                            let count_heart = post['count_heart']
                            let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['username']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                         <img class="is-rounded" src="../static/${img}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post['profile_name']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                            $("#post-box").append(html_temp)
                        }
                    }
                }
            })
        }

        // $(document).ready(function () {
        //     get_posts()
        // })

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('preview').src = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                document.getElementById('preview').src = "";
            }
        }