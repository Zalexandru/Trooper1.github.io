const trooper = document.getElementById("trooper");
const road = document.querySelector(".road");
const container = document.querySelector(".container");
const rock = document.querySelector(".rock");
const roadLeft = road.offsetLeft;
const roadRight = roadLeft + road.offsetWidth - trooper.offsetWidth;
const containerRight = container.offsetLeft + container.offsetWidth - trooper.offsetWidth;
const startingTop = trooper.offsetTop;
let leftPosition = roadLeft;
let topPosition = startingTop;
let isJumping = false;
let isMovingLeft = false;
let isMovingRight = false;

document.addEventListener("keydown", function(event) {
  if (event.code === "ArrowLeft") {
    isMovingLeft = true;
  } else if (event.code === "ArrowRight") {
    isMovingRight = true;
  } else if (event.code === "Space") {
    shoot();
  } else if (event.code === "ArrowUp" && !isJumping) {
    isJumping = true;
    let jumpDistance = 0;
    const jumpInterval = setInterval(function() {
      if (topPosition <= startingTop - 100 || jumpDistance >= 100) {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(function() {
          if (topPosition < startingTop) {
            topPosition += 5;
          } else {
            clearInterval(fallInterval);
            isJumping = false;
          }
        }, 17);
      } else {
        topPosition -= 5;
        jumpDistance += 5;
      }
    }, 17);
  }
});

document.addEventListener("keyup", function(event) {
  if (event.code === "ArrowLeft") {
    isMovingLeft = false;
  } else if (event.code === "ArrowRight") {
    isMovingRight = false;
  }
});

setInterval(function() {
  if (isMovingLeft) {
    leftPosition = Math.max(leftPosition - 2.3, roadLeft);
  }
  if (isMovingRight) {
    leftPosition = Math.min(leftPosition + 2.3, roadRight, containerRight);
  }
  trooper.style.left = leftPosition + "px";
  
  // Check if trooper is in front of the rock image
  if (leftPosition + trooper.offsetWidth > rock.offsetLeft) {
    showModal();
  }
}, 17);

setInterval(function() {
  if (isJumping || topPosition !== startingTop) {
    trooper.style.top = topPosition + "px";
  }
}, 17);

function shoot() {
  const bullet = document.createElement("div");
  bullet.style.width = "3px";
  bullet.style.height = "10px";
  bullet.style.backgroundColor = "red";
  bullet.style.position = "absolute";
  bullet.style.left = (leftPosition + trooper.offsetWidth / 2.2) + "px";
  bullet.style.top = (topPosition - 10) + "px";
  container.appendChild(bullet);

  const bulletInterval = setInterval(function() {
    const bulletTop = parseInt(bullet.style.top);
    if (bulletTop <= 0) {
      clearInterval(bulletInterval);
      container.removeChild(bullet);
    } else {
      bullet.style.top = (bulletTop - 10) + "px";
    }
  }, 17);
}

const modal = document.getElementById("modal");
const modalContent = modal.querySelector(".modal-content");

// Get the close button element
const closeBtn = modal.querySelector(".close-btn");

// When the user clicks the close button, close the modal
closeBtn.addEventListener("click", function() {
  closeModal();
});

// When the user clicks outside the modal, close it
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

function openModal() {
  modal.style.display = "block";
  modalContent.style.top = "50%";
  modalContent.style.left = "50%";
  modalContent.style.transform = "translate(50%, 50%)";
}

function closeModal() {
  modal.style.display = "none";
}

function checkCollision() {
  const rock = document.querySelector(".rock");
  const rockRect = rock.getBoundingClientRect();
  const trooperRect = trooper.getBoundingClientRect();

  if (
    rockRect.left < trooperRect.right &&
    rockRect.right > trooperRect.left &&
    rockRect.top < trooperRect.bottom &&
    rockRect.bottom > trooperRect.top
  ) {
    openModal();
  }
}

setInterval(function() {
  checkCollision();
}, 17);
