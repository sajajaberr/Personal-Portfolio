const fetchAboutMeData = async () => {
  try {
    const response = await fetch('./../data/aboutMeData.json');
    if (!response.ok) {
      throw new Error('Error fetching data: ' + response.status + ', ' + response.statusText);
    }

    const aboutMe = document.getElementById('aboutMe');

    const aboutMeData = await response.json();

    const pElement = document.createElement('p');
    pElement.textContent = aboutMeData.aboutMe;
    aboutMe.appendChild(pElement);

    const headshotContainer = document.createElement('div');
    headshotContainer.className = 'headshotContainer';

    const headshotImg = document.createElement('img');
    headshotImg.src = aboutMeData.headshot;
    headshotImg.alt = 'Headshot';

    headshotContainer.appendChild(headshotImg);
    aboutMe.appendChild(headshotContainer);

  } catch (error) {
    console.error(error);
  }
}

fetchAboutMeData();


const fetchProjectsData = async () => {
  try {
    const response = await fetch('./../data/projectsData.json');
    if (!response.ok) {
      throw new Error('Error fetching data: ' + response.status + ', ' + response.statusText);
    }

    let projectList = document.getElementById('projectList');
    
    const projectsData = await response.json();

    const spotlight = document.getElementById('projectSpotlight');
    const spotlightTitle = document.getElementById('spotlightTitles');
    const cardPlaceholder = './../images/card_placeholder_bg.webp';
    const spotlightPlaceholder = './../images/spotlight_placeholder_bg.webp';

    const projectSpotlight = (project) => {
      spotlight.style.backgroundImage = `url(${project.spotlight_image ?? spotlightPlaceholder})`;


      spotlightTitle.innerHTML = `
      <h3>${project.project_name ?? ' '}</h3>
      <p>${project.long_description ?? ' '}</p>
      <a href="${project.url ?? '#'}" target="_blank">
        ${project.url ? 'Click here to see more...' : 'No additional link available.'}
      </a>
    `;
    };


    projectsData.forEach( (project) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'projectCard';
      projectCard.id = project.project_id;
      projectCard.style.backgroundImage = `url(${project.card_image ?? cardPlaceholder})`;
      const projectCardTitle = document.createElement('h4');
      projectCardTitle.textContent = project.project_name ?? ' ';
      const projectCardDescription = document.createElement('p');
      projectCardDescription.textContent = project.short_description ?? ' ';
      projectCard.appendChild(projectCardTitle);
      projectCard.appendChild(projectCardDescription);


      projectCard.addEventListener('click', () => {projectSpotlight(project)} );

      projectList.appendChild(projectCard);



    });



    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');

    const scrollAmount = 300; // Amount to scroll in pixels

    const scroll = (direction) => {
      if (window.matchMedia("(max-width: 768px)").matches) {
      projectList.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      } else {
      projectList.scrollBy({ top: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
    };

    arrowLeft.addEventListener('click', () => scroll('left'));
    arrowRight.addEventListener('click', () => scroll('right'));



  } catch (error) {
    console.error(error);
  }
}

const formValidation = () => {
  const form = document.getElementById('formSection');
  const emailInput = document.getElementById('contactEmail');
  const emailError = document.getElementById('emailError');
  const messageInput = document.getElementById('contactMessage');
  const messageError = document.getElementById('messageError');
  const charactersLeft = document.getElementById('charactersLeft');

  const illegalCharPattern = /[^a-zA-Z0-9@._-]/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxMessageLength = 300;

  const updateCharacterCount = () => {
    const currentLength = messageInput.value.length;
    charactersLeft.textContent = `Characters: ${currentLength}/${maxMessageLength}`;
  }

  const emailValidation = (email) => {
    if (email.length === 0) {
      emailError.textContent = 'Email is required.';
      return false;
    } else if (illegalCharPattern.test(email)) {
      emailError.textContent = 'Email must contains illegal characters.';
      return false;
    } else if (!emailPattern.test(email)) {
      emailError.textContent = 'Invalid email.';
      return false;
    } else {
      emailError.textContent = '';
      return true;
    }
  };

  const messageValidation = (message) => {
    if (message.length === 0) {
      messageError.textContent = 'Message is required.';
      return false;
    } else if (illegalCharPattern.test(message)) {
      messageError.textContent = 'Invalid Message (must have illegal characters).';
      return false;
    } else if (message.length > maxMessageLength) {
      messageError.textContent = `Message too long.`;
      return false;
    } else {
      messageError.textContent = '';
      return true;
    }
  };

  messageInput.addEventListener('input', updateCharacterCount);

  const submitionForm = (event) => {
    event.preventDefault();
    const isEmailValid = emailValidation(emailInput.value.trim());
    const isMessageValid = messageValidation(messageInput.value.trim());

    if (isEmailValid && isMessageValid) {
      alert('Form validation passed!');
      form.reset();
      charactersLeft.textContent = 'Characters: 0/300';
    }
  };
  
  form.addEventListener('submit', submitionForm);
}

fetchProjectsData();
formValidation();