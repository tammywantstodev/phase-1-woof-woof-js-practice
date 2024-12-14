document.addEventListener("DOMContentLoaded", function () {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const goodDogFilter = document.getElementById('good-dog-filter');
    let filterOn = false;

    function getDogs() {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(data => {
                displayDogs(data);

                goodDogFilter.addEventListener('click', () => {
                    filterOn = !filterOn;
                    if(filterOn ===true)
                    {goodDogFilter.innerText='Filter good dogs: ON'
                    goodDogFilter.style.backgroundColor='green'
                        goodDogFilter.style.color='white'
                    }

                    else{
                        goodDogFilter.innerText='Filter good dogs: OFF';
                    }

                    const filteredDogs = filterOn ? data.filter(dog => dog.isGoodDog) : data; // Show all dogs if filter is off

                    displayDogs(filteredDogs);
                });
            })
            .catch(error => console.log(error));
    }

    function displayDogs(dogs) {
        dogBar.innerHTML = '';
        dogs.forEach(dog => {
            const name = document.createElement('p');
            name.innerHTML = `<span>${dog.name}</span>`; // Use span for the dog name
            dogBar.appendChild(name);

            name.addEventListener('click', () => {
                displayDogInfo(dog);
            });
        });
    }

    function displayDogInfo(dog) {
        dogInfo.innerHTML = '';

        const dogImage = document.createElement('img');
        dogImage.src = dog.image;

        const dogName = document.createElement('h2');
        dogName.innerHTML = `<span>${dog.name}</span>`;

        const dogStatus = document.createElement('button');
        dogStatus.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';



        dogInfo.appendChild(dogImage);
        dogInfo.appendChild(dogName);
        dogInfo.appendChild(dogStatus);

        dogStatus.addEventListener('click', () => {
            const newStatus = !dog.isGoodDog;
            dog.isGoodDog = newStatus;
            dogStatus.textContent = newStatus ? 'Good Dog!' : 'Bad Dog!';
            if(newStatus===true){
                dogStatus.textContent='Good Dog!';
                dogStatus.style.backgroundColor='green'
                dogStatus.style.color='white'
            }
            else if(newStatus===false){
                dogStatus.textContent='Bad Dog!';
                dogStatus.style.backgroundColor='red'
                dogStatus.style.color='white'
            }

            fetch(`http://localhost:3000/pups/${dog.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isGoodDog: newStatus }),
            }).catch(error => console.error('Error updating dog:', error));
        });
    }

    getDogs();
});
