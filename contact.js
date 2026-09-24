/* =================================
   QuickCourt - Contact & Feedback
   ================================= */

document.addEventListener("DOMContentLoaded", function () {

    const feedbackForm = document.getElementById("feedbackForm");

    if (feedbackForm) {

        feedbackForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const feedback = {

                id: Date.now(),

                name: document.getElementById("feedbackName").value,

                email: document.getElementById("feedbackEmail").value,

                type: document.getElementById("feedbackType").value,

                rating: document.getElementById("rating").value,

                message: document.getElementById("feedbackMessage").value,

                date: new Date().toLocaleString()

            };


            let feedbackList = JSON.parse(
                localStorage.getItem("quickcourtFeedback")
            ) || [];


            feedbackList.push(feedback);


            localStorage.setItem(
                "quickcourtFeedback",
                JSON.stringify(feedbackList)
            );


            alert("Thank you! Your feedback has been submitted successfully.");


            feedbackForm.reset();

        });

    }

});