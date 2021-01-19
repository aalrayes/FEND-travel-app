import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/fonts.scss'
import {init} from "./js/app"
const submit =  document.getElementById('submit');


submit.addEventListener('click', e=> {
    init(e);
});

export{init}