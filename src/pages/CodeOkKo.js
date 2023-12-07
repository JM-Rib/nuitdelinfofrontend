import React from 'react';
import './CodeOkKo.css';
import Bouton from '../components/Bouton';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/AuthProvider';
import deleteIcon from '../delete.png'

import useApi from '../hooks/useApi';
import okKoApi from '../api/okKo'; //Import the API service function
import githubApi from '../api/github'; //Import the API service function

const ROW_AJOUT = 1;
function CodeOkKo(props) {
  const [editMode, setEditMode] = useState([]);
  
  const getOkKoApi = useApi(okKoApi.getTournois);
  
  useEffect(() => {
    getOkKoApi.request();
  }, []);

  useEffect(() => {
    if (!getOkKoApi.loading && getOkKoApi.data) {
      var tabEditMode = new Array(getOkKoApi.data.length + ROW_AJOUT).fill(false);
      setEditMode(tabEditMode);
    }
  }, [getOkKoApi.loading, getOkKoApi.data]); 

  const handleSubmit = event => {
    event.preventDefault();
    const id = Number.parseInt(window.event.submitter.id);
    const data = {
      nomTournoi: event.target.nomTournoi.value,
      pk_idTournoi: id,
      fk_idSaison: event.target.idSaison.value
    }
    //check submit type:
    if(window.event.submitter.name === "CREATE"){
      createTournoi(data);
    }else if(window.event.submitter.name === "EDIT"){
      editTournoi(id, data);
    }
    //reset affichage du tableau apres envoi.
    var tabEditMode = new Array(editMode.length).fill(false);
    setEditMode(tabEditMode);
  }

  const createTournoi = async (data) => {
    try {
      await okKoApi.postTournoi(data);
      getOkKoApi.request();
    } catch (error) {
    }
  }
  
  const editTournoi = async (id, data) => {
    try {
      await okKoApi.putTournoi(id, data);
      getOkKoApi.request();
    } catch (err) {
      console.error(err);
    }
  }
  
  const removeTournoi = async (id) => {
    const choice = window.confirm("Êtes vous sûr de vouloir supprimer ce tournoi?\n\n\nUne fois supprimé tout les inscrits seront enlevés et il ne pourra plus être récupéré.");
    if (!choice) return;
    try {
      await okKoApi.deleteTournoi(id);
      getOkKoApi.request();
    } catch (error) {
    }
  }
  
  const annuler = () => {//reinitialise les champs d'edition.
    var tabEditMode = new Array(editMode.length).fill(false);//reset affichage du tableau apres envoi.
    setEditMode(tabEditMode);        
  }

	return (
    <div className="EspaceTournois">
      <Bouton  nom="Accueil" type="lien" lien={"/index"}  />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th className='tl-th th-visible'>Nom du tournoi</th>
              <th className='th-visible' >Date début tournoi</th>
              <th className='th-visible' >Date fin tournoi</th>
              <th className='tr-th  th-visible' >Id Saison</th>
            </tr>
          </thead>
          <tbody>
            {/*getOkKoApi.data?.map( (tournoi, n) => ( 
              <tr key={"tabtournois-"+n} className="tr-visible"> 
                <td>{ editMode[n] ?
                  <img src={deleteIcon} className="tournois-delete-icon" alt="" onClick={() => removeTournoi(tournoi.pk_idTournoi)} />
                  :
                  null }
                </td>
                <td className='td-visible'>{ editMode[n] ? 
                  <select name="nomTournoi" defaultValue={tournoi.nomTournoi}>
                    <option value="CNGT" >CNGT</option>
                    <option value="TMC" >TMC</option>
                    <option value="Tournoi de la toussaint">Tournoi de la toussaint</option>
                    <option value="Tournoi interne">Tournoi interne</option>
                  </select>
                  : tournoi.nomTournoi 
                }</td> 
                <td className='td-visible'>{ editMode[n] ?
                  <> 
                  </>
                : 
                  "Hello" }</td>
                <td className='td-visible'>{ editMode[n] ?
                  <> 
                  </>
                : 
                  "Hello" }</td>
                <td className='td-visible'>{ editMode[n] ?
                  <> 
                    <input type="number" id="idSaison" name="idSaison" defaultValue={tournoi.fk_idSaison}></input>
                  </>
                : 
                  tournoi.fk_idSaison }</td>
                <td>{editMode[n] ?
                <>
                  <input type="submit" name="EDIT" value="Envoyer" id={`${tournoi.pk_idTournoi}`}  />
                  <button className='tournois-form-annuler' onClick={() => {annuler()}} >Annuler</button>
                </>
                  :
                <div onClick={ () => {}} >
                  <Bouton nom="Modifier" type="editMode" editMode={editMode} i={n} setEditMode={setEditMode}  ></Bouton>
                </div>
                }</td>
              </tr>
              ))*/}
              { editMode[editMode.length-ROW_AJOUT] ?
                <tr key={"tabtournois-"+editMode.length-ROW_AJOUT} className="tr-visible"> 
                  <td>
                  </td>
                  <td className='td-visible'>
                    <select name="nomTournoi" defaultValue={""}>
                      <option value="CNGT" >CNGT</option>
                      <option value="TMC" >TMC</option>
                      <option value="Tournoi de la toussaint">Tournoi de la toussaint</option>
                      <option value="Tournoi interne">Tournoi interne</option>
                    </select>
                  </td> 
                  <td className='td-visible'>
                    <> 
                    </>
                  </td>
                  <td className='td-visible'>
                    <> 
                    </>
                  </td>
                  <td className='td-visible'>
                    <> 
                      <input type="number" id="idSaison" name="idSaison" defaultValue={""}></input>
                    </>
                  </td>
                  <td>
                    <>
                      <input type="submit" name="CREATE" idbutton={editMode.length-ROW_AJOUT} value="Envoyer"  />
                      {/* <button className='tournois-form-envoyer' onClick={(e) => {createTournoi(e)}} >Envoyer</button> */}
                      <button className='tournois-form-annuler' onClick={() => {annuler()}} >Annuler</button>
                    </>
                  </td>
                </tr>
                :
                <tr>
                  <td></td>
                  <td>
                    <div onClick={ () => {}} >
                      <Bouton nom="Ajouter" type="editMode" editMode={editMode} i={editMode.length-ROW_AJOUT} setEditMode={setEditMode} ></Bouton>
                    </div>
                  </td>
                </tr>
              }
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default CodeOkKo;