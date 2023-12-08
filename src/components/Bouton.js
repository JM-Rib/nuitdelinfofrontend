import './Bouton.css';

import { NavLink } from 'react-router-dom';

function Bouton(props, {callbackvalue, callback}) {

	return (
            <div className="EspaceBouton">
                { (props.type === "submit") ? <button type='submit'>{props.nom}</button> : null }
                { (props.type === "lien") ?  
								<NavLink
    								className="Bouton-NavLink"
    								to={props.lien}
    								exact="true"
								>
									<i className="pi pi-github"></i>{props.nom}
								</NavLink>
					: null }

				{ (props.type === "callback") ?  
					<button onClick={() => props.callback(!props.callbackvalue)}>{props.nom}</button> 
					: null }
				{ (props.type === "onClick") ?  
					<button onClick={() => props.callback()}>{props.nom}</button> 
					: null }
				{ (props.type === "editMode") ?  
					<button type='button' onClick={() => {
						var tabInter = new Array(props.editMode.length).fill(false);
						tabInter[props.i] = true;
						props.setEditMode(tabInter);
					}}>{props.nom}</button> 
					: null }
			</div>
    );
}

export default Bouton;
