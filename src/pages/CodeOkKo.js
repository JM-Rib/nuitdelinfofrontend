import React from 'react';
import { Octokit } from '@octokit/core';
import './CodeOkKo.css';
import Bouton from '../components/Bouton';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/AuthProvider';
import deleteIcon from '../delete.png'
import {convertDateHuman, convertDateSql} from '../utils/dateConverter'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import useApi from '../hooks/useApi';
import okKoApi from '../api/okKo'; //Import the API service function
import githubApi from '../api/github'; //Import the API service function

const ROW_AJOUT = 1;
function CodeOkKo(props) {
  const [editMode, setEditMode] = useState([]);

  const getCommitsApi = useApi(githubApi.getCommits);
  const getCommitContentsApi = useApi(githubApi.getCommitContents);
   
  useEffect(() => {
    getCommitsApi.request();
  }, []);

  useEffect(() => {
    if (!getCommitsApi.loading && getCommitsApi.data) {
      var tabEditMode = new Array(getCommitsApi.data.length + ROW_AJOUT).fill(false);
      setEditMode(tabEditMode);
    }
  }, [getCommitsApi.loading, getCommitsApi.data]); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sha = window.event.submitter.id.split('-')[0];
    const index = window.event.submitter.id.split('-')[1];

    //check submit type:
    if(window.event.submitter.name === "GET_CONTENT"){
      const response = await getCommitContentsApi.request(sha);
      var tabEditMode = new Array(editMode.length).fill(false);
      tabEditMode[index] = true;
      setEditMode(tabEditMode);
    }else if(window.event.submitter.name === "EDIT"){
    }
    //reset affichage du tableau apres envoi.
  }

  const createTournoi = async (data) => {
    try {
      await okKoApi.postTournoi(data);
      getCommitsApi.request();
    } catch (error) {
    }
  }
  
  const editTournoi = async (id, data) => {
    try {
      await okKoApi.putTournoi(id, data);
      getCommitsApi.request();
    } catch (err) {
      console.error(err);
    }
  }
  
  const removeTournoi = async (id) => {
    const choice = window.confirm("Êtes vous sûr de vouloir supprimer ce tournoi?\n\n\nUne fois supprimé tout les inscrits seront enlevés et il ne pourra plus être récupéré.");
    if (!choice) return;
    try {
      await okKoApi.deleteTournoi(id);
      getCommitsApi.request();
    } catch (error) {
    }
  }
  
  const annuler = () => {//reinitialise les champs d'edition.
    var tabEditMode = new Array(editMode.length).fill(false);//reset affichage du tableau apres envoi.
    setEditMode(tabEditMode);        
  }

	return (
    <div className="EspaceOkKo">
      <Bouton  nom="Accueil" type="lien" lien={"/index"}  />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th className='tl-th th-visible'>Nom du dev</th>
              <th className='th-visible' >Date début tournoi</th>
              <th className='th-visible' >Date fin tournoi</th>
              <th className='tr-th  th-visible' >Id Saison</th>
            </tr>
          </thead>
          <tbody>
            { getCommitsApi.data?.map( (commit, n) => ( 
              <>
              <tr key={"tabcommits-"+n} className="tr-visible"> 
                <td className='td-visible'> 
                  <div className="user-profile">
                    <img className="avatar-developpeur" src={commit.author.avatar_url} alt=""></img>
                    <p>{ commit.author.login } </p>
                  </div>
                </td> 
                <td className='td-visible'>
                  { commit.commit.message }</td>
                <td className='td-visible'>
                  { convertDateHuman(commit.commit.author.date)}
                </td>
                <td className='td-visible'>
                  <input type="submit" name="GET_CONTENT" value="Envoyer" id={`${commit.sha}-${n}`}   />
                </td>
              </tr>
              {editMode[n]===true ? 
                <tr>
                  <td colSpan='4'>
                  {getCommitContentsApi.loading === false ? (
                    getCommitContentsApi.data.files.map( (fichier, i) => (
                      <p>{fichier.filename}</p>
                    ))
                  ) : (
                    "Chargement..."
                  )}
                  </td>
                </tr>
              :
                null
              }
              </>
              )) }
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