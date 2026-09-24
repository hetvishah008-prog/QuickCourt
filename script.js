/* =====================================================
   QUICKCOURT - COMPLETE BOOKING SCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const dateInput = document.getElementById("bookingDate");
    const courtSelect = document.getElementById("court");
    const playersSelect = document.getElementById("players");

    const timeSlots = document.querySelectorAll(".time-slot");
    const bookingTimeInput = document.getElementById("bookingTime");

    const courtPriceElement = document.getElementById("court-price");
    const discountElement = document.getElementById("discount-amount");
    const addonsElement = document.getElementById("addons-total");
    const totalElement = document.getElementById("total-amount");

    const paymentElement = document.getElementById("paymentMethod");

    const depositInfo = document.getElementById("deposit-info");
    const depositAmountElement = document.getElementById("deposit-amount");
    const remainingAmountElement = document.getElementById("remaining-amount");

    const confirmButton = document.getElementById("confirm-booking");
    const termsElement = document.getElementById("terms");


    /* =====================================================
       BOOKING VARIABLES
       ===================================================== */

    let selectedTime = "";
    let selectedPrice = 0;
    let selectedDiscount = 0;


    /* =====================================================
       ADD-ON PRICES
       ===================================================== */

    const addonPrices = {

        water: 20,
        protein: 100,
        snacks: 60,
        refreshments: 50,

        cricketKit: 100,
        stumps: 50,
        badmintonKit: 80,
        shuttleCock: 30,
        football: 70

    };


    /* =====================================================
       ADD-ON QUANTITIES
       ===================================================== */

    const addonQuantities = {

        water: 0,
        protein: 0,
        snacks: 0,
        refreshments: 0,

        cricketKit: 0,
        stumps: 0,
        badmintonKit: 0,
        shuttleCock: 0,
        football: 0

    };


    /* =====================================================
       GET TODAY'S DATE
       ===================================================== */

    function getTodayString() {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    /* =====================================================
       PREVENT PREVIOUS DATE SELECTION
       ===================================================== */

    if (dateInput) {

        const todayString = getTodayString();

        dateInput.min = todayString;

        dateInput.addEventListener("change", function () {

            if (dateInput.value < todayString) {

                alert(
                    "Previous dates cannot be selected."
                );

                dateInput.value = "";

                selectedTime = "";
                selectedPrice = 0;
                selectedDiscount = 0;

                timeSlots.forEach(function (slot) {

                    slot.disabled = false;
                    slot.classList.remove("disabled");
                    slot.classList.remove("selected");

                });

                if (bookingTimeInput) {
                    bookingTimeInput.value = "";
                }

                updateBookingSummary();

                return;

            }

            disablePastTimeSlots();

        });

    }


    /* =====================================================
       CONVERT TIME INTO MINUTES
       ===================================================== */

    function convertTimeToMinutes(timeText) {

        if (!timeText) {
            return null;
        }

        const match = timeText.match(
            /(\d{1,2}):(\d{2})\s*(AM|PM)/i
        );

        if (!match) {
            return null;
        }

        let hours = parseInt(match[1], 10);

        const minutes = parseInt(match[2], 10);

        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) {
            hours += 12;
        }

        if (period === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;

    }


    /* =====================================================
       GET CURRENT TIME IN MINUTES
       ===================================================== */

    function getCurrentMinutes() {

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );

    }


    /* =====================================================
       DISABLE PASSED TIME SLOTS
       ===================================================== */

    function disablePastTimeSlots() {

        if (!dateInput) {
            return;
        }

        const selectedDate = dateInput.value;
        const todayString = getTodayString();

        if (!selectedDate) {

            timeSlots.forEach(function (slot) {

                slot.disabled = false;
                slot.classList.remove("disabled");

            });

            return;

        }


        /* Previous date safety */

        if (selectedDate < todayString) {

            timeSlots.forEach(function (slot) {

                slot.disabled = true;
                slot.classList.add("disabled");
                slot.classList.remove("selected");

            });

            selectedTime = "";
            selectedPrice = 0;
            selectedDiscount = 0;

            if (bookingTimeInput) {
                bookingTimeInput.value = "";
            }

            updateBookingSummary();

            return;

        }


        /* Future date: enable every slot */

        if (selectedDate > todayString) {

            timeSlots.forEach(function (slot) {

                slot.disabled = false;
                slot.classList.remove("disabled");

            });

            return;

        }


        /* Today's date: disable passed slots */

        const currentMinutes = getCurrentMinutes();

        timeSlots.forEach(function (slot) {

            const timeText = slot.getAttribute("data-time");

            if (!timeText) {
                return;
            }

            const startingTime = timeText
                .split("-")[0]
                .trim();

            const slotStartMinutes =
                convertTimeToMinutes(startingTime);

            if (slotStartMinutes === null) {
                return;
            }

            if (slotStartMinutes <= currentMinutes) {

                slot.disabled = true;
                slot.classList.add("disabled");
                slot.classList.remove("selected");

                if (selectedTime === timeText) {

                    selectedTime = "";
                    selectedPrice = 0;
                    selectedDiscount = 0;

                    if (bookingTimeInput) {
                        bookingTimeInput.value = "";
                    }

                }

            } else {

                slot.disabled = false;
                slot.classList.remove("disabled");

            }

        });

        updateBookingSummary();

    }


    /* =====================================================
       PLAYER LIMITS
       ===================================================== */

    function updatePlayerLimits() {

        if (!courtSelect || !playersSelect) {
            return;
        }

        const selectedCourt =
            courtSelect.value.toLowerCase();

        const playerOptions =
            playersSelect.querySelectorAll("option");

        playerOptions.forEach(function (option) {

            const playerCount =
                parseInt(option.value, 10);

            if (isNaN(playerCount)) {
                return;
            }

            if (
                selectedCourt.includes("smash") &&
                selectedCourt.includes("badminton")
            ) {

                option.hidden =
                    playerCount < 2 ||
                    playerCount > 4;

            } else {

                option.hidden =
                    playerCount > 12;

            }

        });


        const selectedPlayers =
            parseInt(playersSelect.value, 10);

        if (
            selectedCourt.includes("smash") &&
            selectedCourt.includes("badminton") &&
            (
                isNaN(selectedPlayers) ||
                selectedPlayers < 2 ||
                selectedPlayers > 4
            )
        ) {

            playersSelect.value = "";

        }

    }


    if (courtSelect) {

        courtSelect.addEventListener(
            "change",
            updatePlayerLimits
        );

    }

    updatePlayerLimits();


    /* =====================================================
       TIME SLOT SELECTION
       ===================================================== */

    timeSlots.forEach(function (slot) {

        slot.addEventListener("click", function () {

            if (
                slot.disabled ||
                slot.classList.contains("disabled")
            ) {
                return;
            }


            /* Remove previous selection */

            timeSlots.forEach(function (item) {

                item.classList.remove("selected");

            });


            /* Select current slot */

            slot.classList.add("selected");

            selectedTime =
                slot.getAttribute("data-time") || "";

            selectedPrice =
                Number(
                    slot.getAttribute("data-price")
                ) || 0;


            /* Calculate 10% discount from 12 PM to 4 PM */

            const slotStartTime =
                convertTimeToMinutes(
                    selectedTime.split("-")[0].trim()
                );

            const slotEndTime =
                convertTimeToMinutes(
                    selectedTime.split("-")[1].trim()
                );


            if (
                slotStartTime !== null &&
                slotEndTime !== null &&
                slotStartTime >= 720 &&
                slotEndTime <= 960
            ) {

                selectedDiscount =
                    selectedPrice * 0.10;

            } else {

                selectedDiscount = 0;

            }


            if (bookingTimeInput) {

                bookingTimeInput.value =
                    selectedTime;

            }

            updateBookingSummary();

        });

    });


    /* =====================================================
       ADD-ON TOTAL
       ===================================================== */

    function calculateAddonTotal() {

        let total = 0;

        for (const addon in addonQuantities) {

            total +=
                addonQuantities[addon] *
                addonPrices[addon];

        }

        return total;

    }


    /* =====================================================
       CHANGE ADD-ON QUANTITY
       ===================================================== */

    window.changeAddon = function (addonName, change) {

        if (
            !Object.prototype.hasOwnProperty.call(
                addonQuantities,
                addonName
            )
        ) {
            return;
        }


        addonQuantities[addonName] += change;


        if (addonQuantities[addonName] < 0) {

            addonQuantities[addonName] = 0;

        }


        const quantityElement =
            document.getElementById(
                `${addonName}-qty`
            );

        if (quantityElement) {

            quantityElement.textContent =
                addonQuantities[addonName];

        }

        updateBookingSummary();

    };


    /* =====================================================
       UPDATE BOOKING SUMMARY
       ===================================================== */

    function updateBookingSummary() {

        const addonsTotal =
            calculateAddonTotal();

        const finalAmount =
            Math.max(
                0,
                selectedPrice -
                selectedDiscount +
                addonsTotal
            );

        const depositAmount =
            Math.round(finalAmount * 0.50);

        const remainingAmount =
            Math.round(
                finalAmount - depositAmount
            );


        if (courtPriceElement) {

            courtPriceElement.textContent =
                `₹${Math.round(selectedPrice)}`;

        }


        if (discountElement) {

            discountElement.textContent =
                `-₹${Math.round(selectedDiscount)}`;

        }


        if (addonsElement) {

            addonsElement.textContent =
                `₹${Math.round(addonsTotal)}`;

        }


        if (totalElement) {

            totalElement.textContent =
                `₹${Math.round(finalAmount)}`;

        }


        if (depositAmountElement) {

            depositAmountElement.textContent =
                `₹${depositAmount}`;

        }


        if (remainingAmountElement) {

            remainingAmountElement.textContent =
                `₹${remainingAmount}`;

        }


        /* Show Pay Later details */

        if (depositInfo && paymentElement) {

            const paymentValue =
                paymentElement.value.toLowerCase();

            if (
                paymentValue.includes("pay later") ||
                paymentValue.includes("paylater")
            ) {

                depositInfo.style.display = "block";

            } else {

                depositInfo.style.display = "none";

            }

        }

    }


    /* =====================================================
       PAYMENT CHANGE
       ===================================================== */

    if (paymentElement) {

        paymentElement.addEventListener(
            "change",
            updateBookingSummary
        );

    }


    /* =====================================================
       COURT FROM URL
       ===================================================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const courtFromURL =
        urlParams.get("court");

    if (courtFromURL && courtSelect) {

        courtSelect.value = courtFromURL;

        updatePlayerLimits();

    }


    /* =====================================================
       CONFIRM BOOKING
       ===================================================== */

    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function () {


                /* Validate date */

                if (
                    !dateInput ||
                    !dateInput.value
                ) {

                    alert(
                        "Please select a booking date."
                    );

                    return;

                }


                /* Prevent previous dates */

                if (
                    dateInput.value <
                    getTodayString()
                ) {

                    alert(
                        "Previous dates cannot be booked."
                    );

                    dateInput.value = "";

                    return;

                }


                /* Validate players */

                if (
                    !playersSelect ||
                    !playersSelect.value
                ) {

                    alert(
                        "Please select the number of players."
                    );

                    return;

                }


                const selectedCourt =
                    courtSelect.value.toLowerCase();

                const selectedPlayers =
                    parseInt(
                        playersSelect.value,
                        10
                    );


                if (
                    selectedCourt.includes("smash") &&
                    selectedCourt.includes("badminton") &&
                    (
                        selectedPlayers < 2 ||
                        selectedPlayers > 4
                    )
                ) {

                    alert(
                        "Badminton allows minimum 2 and maximum 4 players."
                    );

                    return;

                }


                if (
                    !selectedCourt.includes("smash") &&
                    selectedPlayers > 12
                ) {

                    alert(
                        "This court allows maximum 12 players."
                    );

                    return;

                }


                /* Validate time */

                if (!selectedTime) {

                    alert(
                        "Please select a time slot."
                    );

                    return;

                }


                /* Validate payment */

                if (
                    !paymentElement ||
                    !paymentElement.value
                ) {

                    alert(
                        "Please select a payment method."
                    );

                    return;

                }


                /* Validate terms */

                if (
                    !termsElement ||
                    !termsElement.checked
                ) {

                    alert(
                        "Please accept the Terms and Conditions."
                    );

                    return;

                }


                /* Calculate amount */

                const addonsTotal =
                    calculateAddonTotal();

                const finalAmount =
                    Math.round(
                        selectedPrice -
                        selectedDiscount +
                        addonsTotal
                    );

                const depositAmount =
                    Math.round(
                        finalAmount * 0.50
                    );

                const remainingAmount =
                    finalAmount - depositAmount;


                /* Create booking */

                const booking = {

                    id: Date.now(),

                    courtName:
                        courtSelect.value,

                    date:
                        dateInput.value,

                    players:
                        selectedPlayers,

                    time:
                        selectedTime,

                    payment:
                        paymentElement.value,

                    courtPrice:
                        selectedPrice,

                    discount:
                        Math.round(selectedDiscount),

                    addons: {
                        ...addonQuantities
                    },

                    addonsTotal:
                        addonsTotal,

                    amount:
                        finalAmount,

                    depositAmount:
                        depositAmount,

                    remainingAmount:
                        remainingAmount,

                    cancellationPolicy: {

                        threeOrMoreDaysBefore: "10%",
                        twoDaysBefore: "20%",
                        oneDayBefore: "30%",
                        sameDay: "50%"

                    },

                    status:
                        "Confirmed"

                };


                /* Get old bookings safely */

                let bookings = [];

                try {

                    bookings =
                        JSON.parse(
                            localStorage.getItem(
                                "quickcourtBookings"
                            )
                        ) || [];

                } catch (error) {

                    bookings = [];

                }


                /* Save booking */

                bookings.push(booking);

                localStorage.setItem(
                    "quickcourtBookings",
                    JSON.stringify(bookings)
                );


                alert(
                    "Booking confirmed successfully!"
                );

                window.location.href =
                    "history.html";

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    disablePastTimeSlots();

    updateBookingSummary();

});