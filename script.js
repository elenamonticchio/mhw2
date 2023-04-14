/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

//riempie l'array unselected
function start(){
    for(const box of boxes){
        box.addEventListener('click',selectAnswer);
        unselected.push(box);
    }
}

//seleziona una risposta e controlla se la domanda è già stata risposta. 
//Quando tutte e tre le domande sono state risposte rimuove l'event listener
function selectAnswer(event){
    const clicked = event.currentTarget;

    for (const box of selected){
        if(box.dataset.questionId === clicked.dataset.questionId){
            const index=selected.indexOf(box);
            selected.splice(index, 1);
            unselected.push(box);
        }
    }

    selected.push(clicked);
    const checked= clicked.querySelector('.checkbox');
    checked.src= './images/checked.png';

    clicked.classList.add('selected');
    if(clicked.classList.contains('unselected'))
        clicked.classList.remove('unselected');

    const indexToremove = unselected.indexOf(clicked);
    unselected.splice(indexToremove,1);

    for(const box of unselected){
        if(box.dataset.questionId===clicked.dataset.questionId){
            box.classList.add('unselected');
            if(clicked.classList.contains('selected'))
                box.classList.remove('selected');
            const checked= box.querySelector('.checkbox');
            checked.src= './images/unchecked.png';
        }
    }
    
    if(isQuizOver()){
        for(const box of boxes){
            box.removeEventListener('click',selectAnswer);
        }
        solution();
    }
}

//controlla se tutte le domande sono state risposte
function isQuizOver(){
    if(selected.length===3)
        return true;
    return false;
}

//ritorna la personalità più frequente, in caso di pareggio ritorna la personalità corrispondente alla prima risposta selezionata
function findPersonality(){
    const counts = {};
    let max=0;
    let solution='';

    for (const choice of selected) {
        let personality=choice.dataset.choiceId;
        counts[personality] = counts[personality] ? counts[personality] + 1 : 1;
        if(counts[personality]>max){
            max=counts[personality];
            solution=personality;
        }
    }

    return solution;
}

//stampa il risultato del quiz
function solution(){
    const results=document.querySelector('#results');
    let personality=findPersonality();

    const title=document.createElement('h1');
    title.textContent=RESULTS_MAP[personality].title;

    const description=document.createElement('span');
    description.textContent=RESULTS_MAP[personality].contents;

    const restart=document.createElement('div');
    restart.textContent='Ricomincia il quiz';

    results.appendChild(title);
    results.appendChild(description);
    results.appendChild(restart);

    results.classList.remove('hidden');

    restart.addEventListener('click',restartQuiz);
}

//resetta il quiz
function restartQuiz(event){
    unselected.splice(0);
    selected.splice(0);
    const results=document.querySelector('#results');
    results.classList.add('hidden');
    results.innerHTML='';
    start();
    for(const box of unselected){
        if(box.classList.contains('selected')) 
            box.classList.remove('selected');
        else box.classList.remove('unselected');
        const img = box.querySelector('.checkbox');
        img.src='./images/unchecked.png';
    }
}

//main
const unselected = [];
const selected = [];
const boxes= document.querySelectorAll('.choice-grid div');
start();