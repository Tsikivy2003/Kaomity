import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BookOpen, Users, Calendar, GraduationCap, LogOut, Lock, Mail,
  ChevronRight, Plus, Search, Bell, CheckCircle2, XCircle, Clock,
  BarChart3, FileText, Settings, Menu, X, ArrowUpRight, User as UserIcon, Loader2
} from "lucide-react";

/* ---------------------------------------------------------
   CONFIGURATION SUPABASE
   Les clés viennent des variables d'environnement Vite
   (fichier .env — voir .env.example à la racine du projet)
--------------------------------------------------------- */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CLASSES = [
  { id: 1, nom: "Licence 1 — Biologie", effectif: 42, salle: "Amphi B" },
  { id: 2, nom: "Licence 2 — Sciences de l'environnement", effectif: 31, salle: "Salle 12" },
  { id: 3, nom: "Master 1 — Gestion durable des ressources", effectif: 18, salle: "Salle 4" },
];

const ELEVES = [
  { id: 1, nom: "Andrianina Sitraka", classe: "Licence 1 — Biologie", moyenne: 15.4, presence: 96 },
  { id: 2, nom: "Razanadrakoto Fy", classe: "Licence 1 — Biologie", moyenne: 12.1, presence: 88 },
  { id: 3, nom: "Tsikivy Jean Théodoret", classe: "Master 1 — Gestion durable des ressources", moyenne: 17.2, presence: 100 },
  { id: 4, nom: "Rakotomalala Nomena", classe: "Licence 2 — Sciences de l'environnement", moyenne: 9.8, presence: 74 },
  { id: 5, nom: "Ravaka Miora", classe: "Licence 2 — Sciences de l'environnement", moyenne: 14.6, presence: 91 },
];

const EMPLOI_DU_TEMPS = [
  { jour: "Lundi", heure: "08h00–10h00", matiere: "Écologie des forêts", salle: "Amphi B" },
  { jour: "Lundi", heure: "10h15–12h15", matiere: "Statistiques appliquées", salle: "Salle 12" },
  { jour: "Mardi", heure: "08h00–10h00", matiere: "Biologie de la conservation", salle: "Salle 4" },
  { jour: "Mercredi", heure: "13h00–15h00", matiere: "Méthodologie de recherche", salle: "Amphi B" },
  { jour: "Jeudi", heure: "08h00–11h00", matiere: "Travaux pratiques — Terrain", salle: "Parc Ranomafana" },
  { jour: "Vendredi", heure: "09h00–11h00", matiere: "Séminaire FOLUR Madagascar", salle: "Salle 4" },
];

const ANNONCES = [
  { titre: "Dépôt des relevés de notes du semestre", date: "18 août", tag: "Administratif" },
  { titre: "Sortie terrain — Parc National de Ranomafana", date: "22 août", tag: "Pédagogie" },
  { titre: "Réunion du conseil scientifique FOLUR", date: "27 août", tag: "Recherche" },
];

/* ---------------------------------------------------------
   ÉCRAN DE CONNEXION / INSCRIPTION (Supabase Auth)
--------------------------------------------------------- */
function EcranConnexion({ onConnexion }) {
  const [mode, setMode] = useState("connexion"); // "connexion" | "inscription"
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [enCours, setEnCours] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setMessage("");
    setEnCours(true);

    if (mode === "connexion") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: motDePasse,
      });
      if (error) {
        setErreur(traduireErreur(error.message));
      } else if (data?.session) {
        onConnexion(data.session);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: motDePasse,
        options: { data: { nom: nom.trim() || email.trim(), role: "eleve" } },
      });
      if (error) {
        setErreur(traduireErreur(error.message));
      } else {
        setMessage("Compte créé. Vérifiez votre boîte e-mail si la confirmation est activée, sinon connectez-vous directement.");
        setMode("connexion");
      }
    }
    setEnCours(false);
  };

  return (
    <div className="ecran-connexion">
      <div className="panneau-gauche">
        <div className="marque">
          <div className="marque-icone"><BookOpen size={22} strokeWidth={2.2} /></div>
          <span>Kaomity</span>
        </div>

        <div className="panneau-gauche-contenu">
          <p className="eyebrow">Registre d'établissement</p>
          <h1>La salle des professeurs,<br />version numérique.</h1>
          <p className="panneau-gauche-texte">
            Classes, présences, notes et emploi du temps réunis dans un seul cahier —
            consultable par la direction, le corps enseignant et les élèves.
          </p>

          <div className="ligne-perforation" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
          </div>

          <div className="stats-mini">
            <div>
              <strong>91</strong>
              <span>élèves inscrits</span>
            </div>
            <div>
              <strong>12</strong>
              <span>enseignants</span>
            </div>
            <div>
              <strong>6</strong>
              <span>filières actives</span>
            </div>
          </div>
        </div>

        <p className="panneau-gauche-pied">Université de Fianarantsoa — Année universitaire 2026–2027</p>
      </div>

      <div className="panneau-droit">
        <form className="carte-connexion" onSubmit={soumettre}>
          <h2>{mode === "connexion" ? "Connexion" : "Créer un compte"}</h2>
          <p className="sous-titre">
            {mode === "connexion"
              ? "Accédez à votre espace de gestion scolaire."
              : "Inscrivez-vous en tant qu'élève. La direction pourra ajuster votre rôle."}
          </p>

          {mode === "inscription" && (
            <label className="champ">
              <span>Nom complet</span>
              <div className="champ-input">
                <UserIcon size={17} strokeWidth={2} />
                <input
                  type="text"
                  required
                  placeholder="Rakoto Andry"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </label>
          )}

          <label className="champ">
            <span>Adresse e-mail</span>
            <div className="champ-input">
              <Mail size={17} strokeWidth={2} />
              <input
                type="email"
                required
                placeholder="prenom.nom@efianar.mg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </label>

          <label className="champ">
            <span>Mot de passe</span>
            <div className="champ-input">
              <Lock size={17} strokeWidth={2} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete={mode === "connexion" ? "current-password" : "new-password"}
              />
            </div>
          </label>

          {erreur && <div className="message-erreur"><XCircle size={16} /> {erreur}</div>}
          {message && <div className="message-succes"><CheckCircle2 size={16} /> {message}</div>}

          <button type="submit" className="bouton-principal" disabled={enCours}>
            {enCours ? (
              <><Loader2 size={16} className="icone-rotation" /> Veuillez patienter…</>
            ) : (
              <>{mode === "connexion" ? "Se connecter" : "Créer mon compte"} <ChevronRight size={17} /></>
            )}
          </button>

          <button
            type="button"
            className="bouton-texte"
            onClick={() => { setMode(mode === "connexion" ? "inscription" : "connexion"); setErreur(""); setMessage(""); }}
          >
            {mode === "connexion" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

function traduireErreur(msg) {
  if (/invalid login credentials/i.test(msg)) return "Identifiants incorrects. Vérifiez votre adresse et votre mot de passe.";
  if (/user already registered/i.test(msg)) return "Un compte existe déjà avec cette adresse e-mail.";
  if (/password should be at least/i.test(msg)) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (/email not confirmed/i.test(msg)) return "Confirmez votre adresse e-mail avant de vous connecter.";
  return msg;
}

/* ---------------------------------------------------------
   COMPOSANTS DU TABLEAU DE BORD
--------------------------------------------------------- */
function CarteStat({ icone: Icone, libelle, valeur, delta, accent }) {
  return (
    <div className="carte-stat">
      <div className={`carte-stat-icone accent-${accent}`}><Icone size={18} strokeWidth={2.1} /></div>
      <div>
        <p className="carte-stat-valeur">{valeur}</p>
        <p className="carte-stat-libelle">{libelle}</p>
      </div>
     </div>
        {delta && <span className="carte-stat-delta"><ArrowUpRight size={13} />{delta}</span>}
    </div>
  );
}

function VueEnsemble({ utilisateur }) {
  const estAdmin = utilisateur.role === "admin";
  const estEnseignant = utilisateur.role === "enseignant";
  const estEleve = utilisateur.role === "eleve";

  return (
    <div className="vue">
      <div className="vue-entete">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1>Bonjour, {utilisateur.nom.split(" ")[0]}</h1>
        </div>
      </div>

      <div className="grille-stats">
        {estAdmin && (
          <>
            <CarteStat icone={Users} libelle="Élèves inscrits" valeur="91" delta="+4 ce mois" accent="terre" />
            <CarteStat icone={GraduationCap} libelle="Enseignants" valeur="12" accent="raphia" />
            <CarteStat icone={BookOpen} libelle="Classes actives" valeur="6" accent="or" />
            <CarteStat icone={CheckCircle2} libelle="Taux de présence" valeur="91 %" delta="+2 pts" accent="raphia" />
          </>
        )}
        {estEnseignant && (
          <>
            <CarteStat icone={Users} libelle="Élèves suivis" valeur="91" accent="terre" />
            <CarteStat icone={BookOpen} libelle="Classes en charge" valeur="3" accent="or" />
            <CarteStat icone={FileText} libelle="Notes à saisir" valeur="7" accent="terre" />
            <CarteStat icone={CheckCircle2} libelle="Présence moyenne" valeur="91 %" accent="raphia" />
          </>
        )}
        {estEleve && (
          <>
            <CarteStat icone={BarChart3} libelle="Moyenne générale" valeur="17,2 / 20" delta="+0,6" accent="raphia" />
            <CarteStat icone={CheckCircle2} libelle="Taux de présence" valeur="100 %" accent="raphia" />
            <CarteStat icone={BookOpen} libelle="Cours cette semaine" valeur="6" accent="or" />
            <CarteStat icone={FileText} libelle="Devoirs à rendre" valeur="2" accent="terre" />
          </>
        )}
      </div>

      <div className="grille-double">
        <div className="panneau">
          <div className="panneau-entete">
            <h2>Emploi du temps</h2>
            <span className="lien-discret">Semaine du 11 août</span>
          </div>
          <div className="liste-emploi">
            {EMPLOI_DU_TEMPS.map((c, i) => (
              <div className="ligne-emploi" key={i}>
                <div className="ligne-emploi-jour">{c.jour}</div>
                <div className="ligne-emploi-detail">
                  <p>{c.matiere}</p>
                  <span><Clock size={13} /> {c.heure} · {c.salle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panneau">
          <div className="panneau-entete">
            <h2>Annonces</h2>
            <Bell size={16} strokeWidth={2} />
          </div>
          <div className="liste-annonces">
            {ANNONCES.map((a, i) => (
              <div className="item-annonce" key={i}>
                <span className="tag-annonce">{a.tag}</span>
                <p>{a.titre}</p>
                <span className="date-annonce">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VueEleves({ utilisateur }) {
  const [recherche, setRecherche] = useState("");
  const peutModifier = utilisateur.role !== "eleve";

  const elevesFiltres = useMemo(
    () => ELEVES.filter((e) => e.nom.toLowerCase().includes(recherche.toLowerCase())),
    [recherche]
  );

  return (
    <div className="vue">
      <div className="vue-entete">
        <div>
          <p className="eyebrow">Registre</p>
          <h1>Élèves</h1>
        </div>
        {peutModifier && (
          <button className="bouton-secondaire"><Plus size={16} /> Ajouter un élève</button>
        )}
      </div>

      <div className="barre-recherche">
        <Search size={16} strokeWidth={2} />
        <input
          placeholder="Rechercher un élève…"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </div>

      <div className="panneau">
        <table className="table-fiches">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Classe</th>
              <th>Moyenne</th>
              <th>Présence</th>
            </tr>
          </thead>
          <tbody>
            {elevesFiltres.map((e) => (
              <tr key={e.id}>
                <td className="cellule-nom">{e.nom}</td>
                <td className="cellule-discrete">{e.classe}</td>
                <td>
                  <span className={`pastille ${e.moyenne >= 10 ? "pastille-ok" : "pastille-attention"}`}>
                    {e.moyenne.toFixed(1)} / 20
                  </span>
                </td>
                <td className="cellule-discrete">{e.presence} %</td>
              </tr>
            ))}
            {elevesFiltres.length === 0 && (
              <tr><td colSpan={4} className="cellule-vide">Aucun élève ne correspond à cette recherche.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VueClasses({ utilisateur }) {
  return (
    <div className="vue">
      <div className="vue-entete">
        <div>
          <p className="eyebrow">Registre</p>
          <h1>Classes</h1>
        </div>
        {utilisateur.role === "admin" && (
          <button className="bouton-secondaire"><Plus size={16} /> Créer une classe</button>
        )}
      </div>

      <div className="grille-classes">
        {CLASSES.map((c) => (
          <div className="carte-classe" key={c.id}>
            <div className="carte-classe-entete">
              <h3>{c.nom}</h3>
              <span className="tag-annonce">{c.salle}</span>
            </div>
            <p className="carte-classe-effectif"><Users size={14} /> {c.effectif} élèves</p>
            <div className="ligne-perforation ligne-perforation--petite" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
            </div>
            <button className="lien-discret lien-avec-fleche">Voir la fiche <ChevronRight size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VuePresences({ utilisateur }) {
  const [statuts, setStatuts] = useState(() =>
    Object.fromEntries(ELEVES.map((e) => [e.id, "present"]))
  );
  const peutModifier = utilisateur.role !== "eleve";

  const basculer = (id, statut) => {
    if (!peutModifier) return;
    setStatuts((s) => ({ ...s, [id]: statut }));
  };

  return (
    <div className="vue">
      <div className="vue-entete">
        <div>
          <p className="eyebrow">Appel du jour</p>
          <h1>Présences</h1>
        </div>
      </div>

      <div className="panneau">
        <div className="liste-presence">
          {ELEVES.map((e) => (
            <div className="ligne-presence" key={e.id}>
              <span className="ligne-presence-nom">{e.nom}</span>
              <span className="ligne-presence-classe">{e.classe}</span>
              <div className="ligne-presence-actions">
                <button
                  className={`bouton-statut ${statuts[e.id] === "present" ? "bouton-statut--present" : ""}`}
                  onClick={() => basculer(e.id, "present")}
                  disabled={!peutModifier}
                >
                  <CheckCircle2 size={15} /> Présent
                </button>
                <button
                  className={`bouton-statut ${statuts[e.id] === "absent" ? "bouton-statut--absent" : ""}`}
                  onClick={() => basculer(e.id, "absent")}
                  disabled={!peutModifier}
                >
                  <XCircle size={15} /> Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   COQUILLE DU TABLEAU DE BORD
--------------------------------------------------------- */
const NAVIGATION = [
  { id: "ensemble", label: "Vue d'ensemble", icone: BarChart3 },
  { id: "eleves", label: "Élèves", icone: Users },
  { id: "classes", label: "Classes", icone: BookOpen },
  { id: "presences", label: "Présences", icone: CheckCircle2 },
];

function Tableau({ utilisateur, onDeconnexion }) {
  const [ongletActif, setOngletActif] = useState("ensemble");
  const [menuOuvert, setMenuOuvert] = useState(false);

  const libelleRole = utilisateur.role === "admin" ? "Direction"
    : utilisateur.role === "enseignant" ? "Enseignant" : "Élève";

  const initiales = utilisateur.nom.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div className="app-shell">
      <button className="bouton-menu-mobile" onClick={() => setMenuOuvert(true)} aria-label="Ouvrir le menu">
        <Menu size={20} />
      </button>

      <aside className={`barre-laterale ${menuOuvert ? "barre-laterale--ouverte" : ""}`}>
        <div className="barre-laterale-entete">
          <div className="marque marque--sombre">
            <div className="marque-icone"><BookOpen size={19} strokeWidth={2.2} /></div>
            <span>Kaomity</span>
          </div>
          <button className="bouton-fermer-mobile" onClick={() => setMenuOuvert(false)} aria-label="Fermer le menu">
            <X size={18} />
          </button>
        </div>

        <nav className="navigation">
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${ongletActif === item.id ? "nav-item--actif" : ""}`}
              onClick={() => { setOngletActif(item.id); setMenuOuvert(false); }}
            >
              <item.icone size={17} strokeWidth={2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="barre-laterale-pied">
          <button className="nav-item"><Settings size={17} strokeWidth={2} /> Paramètres</button>
          <div className="profil">
            <div className="profil-avatar">{initiales}</div>
            <div className="profil-info">
              <p>{utilisateur.nom}</p>
              <span>{libelleRole}</span>
            </div>
          </div>
          <button className="bouton-deconnexion" onClick={onDeconnexion}>
            <LogOut size={16} strokeWidth={2} /> Se déconnecter
          </button>
        </div>
      </aside>

      {menuOuvert && <div className="voile-mobile" onClick={() => setMenuOuvert(false)} />}

      <main className="contenu-principal">
        {ongletActif === "ensemble" && <VueEnsemble utilisateur={utilisateur} />}
        {ongletActif === "eleves" && <VueEleves utilisateur={utilisateur} />}
        {ongletActif === "classes" && <VueClasses utilisateur={utilisateur} />}
        {ongletActif === "presences" && <VuePresences utilisateur={utilisateur} />}
      </main>
    </div>
  );
}

/* ---------------------------------------------------------
   RACINE DE L'APPLICATION
--------------------------------------------------------- */
export default function EcoleApp() {
  const [session, setSession] = useState(undefined); // undefined = pas encore vérifié
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargementProfil, setChargementProfil] = useState(false);
  const [erreurProfil, setErreurProfil] = useState("");

  const chargerProfil = useCallback(async (sessionActive) => {
    if (!sessionActive?.user) {
      setUtilisateur(null);
      return;
    }
    setChargementProfil(true);
    setErreurProfil("");
    const { data, error } = await supabase
      .from("profils")
      .select("id, nom, role")
      .eq("id", sessionActive.user.id)
      .single();

    if (error) {
      setErreurProfil("Impossible de charger le profil. Réessayez ou reconnectez-vous.");
      setUtilisateur(null);
    } else {
      setUtilisateur({ id: data.id, nom: data.nom, role: data.role, email: sessionActive.user.email });
    }
    setChargementProfil(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      chargerProfil(data.session);
    });

    const { data: abonnement } = supabase.auth.onAuthStateChange((_evenement, sessionActive) => {
      setSession(sessionActive);
      chargerProfil(sessionActive);
    });

    return () => abonnement.subscription.unsubscribe();
  }, [chargerProfil]);

  const seDeconnecter = async () => {
    await supabase.auth.signOut();
    setUtilisateur(null);
  };

  const chargementInitial = session === undefined;

  let contenu;
  if (chargementInitial) {
    contenu = (
      <div className="ecran-chargement">
        <Loader2 size={22} className="icone-rotation" />
        <span>Chargement de Kaomity…</span>
      </div>
    );
  } else if (!session) {
    contenu = <EcranConnexion onConnexion={setSession} />;
  } else if (chargementProfil || !utilisateur) {
    contenu = (
      <div className="ecran-chargement">
        <Loader2 size={22} className="icone-rotation" />
        <span>Préparation de votre espace…</span>
        {erreurProfil && (
          <div className="message-erreur" style={{ marginTop: 16 }}>
            <XCircle size={16} /> {erreurProfil}
          </div>
        )}
      </div>
    );
  } else {
    contenu = <Tableau utilisateur={utilisateur} onDeconnexion={seDeconnecter} />;
  }

  return (
    <div className="racine">
      <style>{STYLES}</style>
      {contenu}
    </div>
  );
}

/* ---------------------------------------------------------
   STYLES
--------------------------------------------------------- */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --encre:#1B2A2F;
  --encre-clair:#28393E;
  --papier:#F7F3EC;
  --papier-carte:#FFFDF9;
  --terre:#C4622D;
  --terre-clair:#F0DACB;
  --raphia:#4C7A5E;
  --raphia-clair:#DCEADF;
  --or:#D9A441;
  --or-clair:#F5E4BE;
  --ligne:#E4DDCD;
  --texte-doux:#6B675D;
}

*{box-sizing:border-box;}
.racine{
  font-family:'Inter',system-ui,sans-serif;
  color:var(--encre);
  background:var(--papier);
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
h1,h2,h3{ font-family:'Fraunces',serif; margin:0; letter-spacing:-0.01em; }
p{margin:0;}
button{font-family:inherit; cursor:pointer;}
input{font-family:inherit;}
.eyebrow{
  font-size:12px; text-transform:uppercase; letter-spacing:0.11em;
  color:var(--terre); font-weight:600; margin-bottom:6px;
}

/* ---------- ÉCRAN DE CONNEXION ---------- */
.ecran-connexion{
  display:grid; grid-template-columns:1.1fr 1fr; min-height:100vh;
}
.marque{ display:flex; align-items:center; gap:10px; font-family:'Fraunces',serif; font-weight:600; font-size:19px; }
.marque-icone{
  width:34px; height:34px; border-radius:9px; background:var(--terre); color:#fff;
  display:flex; align-items:center; justify-content:center;
}
.marque--sombre{ color:var(--papier); }

.panneau-gauche{
  background:var(--encre); color:var(--papier);
  padding:52px 56px; display:flex; flex-direction:column; justify-content:space-between;
  position:relative; overflow:hidden;
}
.panneau-gauche::before{
  content:''; position:absolute; inset:0;
  background-image:radial-gradient(circle at 85% 12%, rgba(217,164,65,0.14), transparent 45%),
                    radial-gradient(circle at 10% 90%, rgba(76,122,94,0.18), transparent 50%);
  pointer-events:none;
}
.panneau-gauche-contenu{ max-width:460px; position:relative; }
.panneau-gauche h1{
  font-size:38px; line-height:1.14; font-weight:600; color:#fff; margin:14px 0 18px;
}
.panneau-gauche-texte{ color:#C9CEC7; font-size:15px; line-height:1.6; }
.panneau-gauche-pied{ font-size:12.5px; color:#8B9490; position:relative; }

.ligne-perforation{
  display:flex; gap:10px; margin:30px 0 26px;
}
.ligne-perforation span{
  width:7px; height:7px; border-radius:50%; background:rgba(247,243,236,0.16);
}
.ligne-perforation--petite{ margin:14px 0; }
.ligne-perforation--petite span{ background:var(--ligne); width:5px; height:5px;} 

.stats-mini{ display:flex; gap:34px; }
.stats-mini strong{ display:block; font-family:'Fraunces',serif; font-size:26px; color:var(--or); }
.stats-mini span{ font-size:12px; color:#9AA29D; }

.panneau-droit{ display:flex; align-items:center; justify-content:center; padding:40px; background:var(--papier); }
.carte-connexion{
  width:100%; max-width:400px; background:var(--papier-carte);
  border:1px solid var(--ligne); border-radius:16px; padding:38px 34px;
  box-shadow:0 20px 50px -25px rgba(27,42,47,0.25);
}
.carte-connexion h2{ font-size:26px; font-weight:600; }
.sous-titre{ color:var(--texte-doux); font-size:14px; margin-top:6px; margin-bottom:26px; }

.champ{ display:block; margin-bottom:16px; }
.champ span{ display:block; font-size:12.5px; font-weight:600; margin-bottom:6px; color:var(--encre); }
.champ-input{
  display:flex; align-items:center; gap:9px; border:1.4px solid var(--ligne);
  border-radius:10px; padding:11px 13px; background:#fff; transition:border-color .15s;
}
.champ-input:focus-within{ border-color:var(--terre); }
.champ-input svg{ color:var(--texte-doux); flex-shrink:0; }
.champ-input input{ border:none; outline:none; width:100%; font-size:14.5px; background:transparent; }

.message-erreur{
  display:flex; align-items:center; gap:7px; font-size:13px; color:#B3401F;
  background:var(--terre-clair); padding:9px 12px; border-radius:8px; margin-bottom:16px;
}
.message-succes{
  display:flex; align-items:center; gap:7px; font-size:13px; color:#2E5A40;
  background:var(--raphia-clair); padding:9px 12px; border-radius:8px; margin-bottom:16px;
}
.bouton-texte{
  width:100%; text-align:center; background:none; border:none; color:var(--texte-doux);
  font-size:13px; padding:14px 0 0; text-decoration:underline; text-underline-offset:2px;
}
.bouton-texte:hover{ color:var(--encre); }

.icone-rotation{ animation:tourner 0.9s linear infinite; }
@keyframes tourner{ to{ transform:rotate(360deg); } }

.ecran-chargement{
  min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:12px; color:var(--texte-doux); font-size:14px;
}
.ecran-chargement svg{ color:var(--terre); }

.bouton-principal{
  width:100%; background:var(--encre); color:#fff; border:none; border-radius:10px;
  padding:12.5px; font-size:14.5px; font-weight:600; display:flex; align-items:center;
  justify-content:center; gap:6px; transition:background .15s;
}
.bouton-principal:hover{ background:var(--encre-clair); }
.bouton-principal:disabled{ opacity:0.6; cursor:default; }

.separateur{ text-align:center; margin:24px 0 16px; position:relative; }
.separateur::before{
  content:''; position:absolute; top:50%; left:0; right:0; height:1px; background:var(--ligne);
}
.separateur span{
  position:relative; background:var(--papier-carte); padding:0 10px; font-size:11.5px;
  color:var(--texte-doux); text-transform:uppercase; letter-spacing:0.07em;
}

.comptes-demo{ display:flex; flex-direction:column; gap:8px; }
.puce-demo{
  display:flex; justify-content:space-between; align-items:center; width:100%;
  border:1px solid var(--ligne); background:#fff; border-radius:9px; padding:9px 12px;
  font-size:13px; text-align:left; transition:border-color .15s, background .15s;
}
.puce-demo:hover{ border-color:var(--raphia); background:var(--raphia-clair); }
.puce-role{ font-weight:600; color:var(--raphia); font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; }
.puce-nom{ color:var(--texte-doux); }

/* ---------- COQUILLE APPLICATION ---------- */
.app-shell{ display:flex; min-height:100vh; }
.barre-laterale{
  width:250px; background:var(--encre); color:var(--papier);
  padding:24px 18px; display:flex; flex-direction:column; flex-shrink:0;
  position:sticky; top:0; height:100vh;
}
.barre-laterale-entete{ display:flex; align-items:center; justify-content:space-between; margin-bottom:30px; padding:0 6px; }
.bouton-fermer-mobile, .bouton-menu-mobile{ display:none; background:none; border:none; color:inherit; }

.navigation{ display:flex; flex-direction:column; gap:3px; flex:1; }
.nav-item{
  display:flex; align-items:center; gap:11px; padding:10px 12px; border-radius:9px;
  border:none; background:none; color:#B9C0BB; font-size:14px; font-weight:500; text-align:left;
  transition:background .15s, color .15s;
}
.nav-item:hover{ background:rgba(247,243,236,0.06); color:#fff; }
.nav-item--actif{ background:var(--terre); color:#fff; }

.barre-laterale-pied{ border-top:1px solid rgba(247,243,236,0.12); padding-top:16px; margin-top:12px; }
.profil{ display:flex; align-items:center; gap:10px; padding:10px 6px; margin-top:6px; }
.profil-avatar{
  width:34px; height:34px; border-radius:50%; background:var(--or); color:var(--encre);
  display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0;
}
.profil-info p{ font-size:13.5px; font-weight:600; color:#fff; line-height:1.2; }
.profil-info span{ font-size:11.5px; color:#9AA29D; }
.bouton-deconnexion{
  display:flex; align-items:center; gap:8px; width:100%; background:none; border:none;
  color:#C9CEC7; font-size:13px; padding:9px 6px; margin-top:6px; border-radius:8px; transition:background .15s;
}
.bouton-deconnexion:hover{ background:rgba(247,243,236,0.06); color:#fff; }

.voile-mobile{ display:none; }

.contenu-principal{ flex:1; padding:36px 44px; max-width:1100px; }

/* ---------- VUES ---------- */
.vue-entete{ display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:26px; gap:16px; flex-wrap:wrap; }
.vue-entete h1{ font-size:28px; font-weight:600; }

.grille-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
.carte-stat{
  background:var(--papier-carte); border:1px solid var(--ligne); border-radius:13px;
  padding:16px 17px; display:flex; align-items:flex-start; gap:12px; position:relative;
}
.carte-stat-icone{ width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.accent-terre{ background:var(--terre-clair); color:var(--terre); }
.accent-raphia{ background:var(--raphia-clair); color:var(--raphia); }
.accent-or{ background:var(--or-clair); color:#8A6417; }
.carte-stat-valeur{ font-family:'Fraunces',serif; font-size:22px; font-weight:600; line-height:1.1; }
.carte-stat-libelle{ font-size:12px; color:var(--texte-doux); margin-top:3px; }
.carte-stat-delta{
  position:absolute; top:14px; right:14px; font-size:11px; color:var(--raphia); font-weight:600;
  display:flex; align-items:center; gap:2px;
}

.grille-double{ display:grid; grid-template-columns:1.4fr 1fr; gap:18px; }
.panneau{ background:var(--papier-carte); border:1px solid var(--ligne); border-radius:14px; padding:22px; }
.panneau-entete{ display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.panneau-entete h2{ font-size:16.5px; font-weight:600; }
.lien-discret{ font-size:12px; color:var(--texte-doux); background:none; border:none; }
.lien-avec-fleche{ display:flex; align-items:center; gap:4px; color:var(--terre); font-weight:600; padding:0; }

.liste-emploi{ display:flex; flex-direction:column; }
.ligne-emploi{ display:flex; gap:16px; padding:11px 0; border-bottom:1px solid var(--ligne); }
.ligne-emploi:last-child{ border-bottom:none; }
.ligne-emploi-jour{ width:78px; flex-shrink:0; font-size:12px; font-weight:600; color:var(--terre); text-transform:uppercase; letter-spacing:0.04em; padding-top:2px; }
.ligne-emploi-detail p{ font-size:14px; font-weight:500; margin-bottom:3px; }
.ligne-emploi-detail span{ display:flex; align-items:center; gap:5px; font-size:12px; color:var(--texte-doux); }

.liste-annonces{ display:flex; flex-direction:column; gap:14px; }
.item-annonce{ padding-bottom:14px; border-bottom:1px solid var(--ligne); }
.item-annonce:last-child{ border-bottom:none; padding-bottom:0; }
.item-annonce p{ font-size:13.5px; font-weight:500; margin:6px 0 4px; line-height:1.4; }
.tag-annonce{
  font-size:10.5px; text-transform:uppercase; letter-spacing:0.05em; font-weight:600;
  color:var(--raphia); background:var(--raphia-clair); padding:3px 8px; border-radius:5px;
}
.date-annonce{ font-size:11.5px; color:var(--texte-doux); }

.barre-recherche{
  display:flex; align-items:center; gap:9px; border:1.4px solid var(--ligne); background:var(--papier-carte);
  border-radius:10px; padding:10px 14px; margin-bottom:18px; max-width:340px;
}
.barre-recherche svg{ color:var(--texte-doux); }
.barre-recherche input{ border:none; outline:none; background:none; font-size:14px; width:100%; }

.bouton-secondaire{
  display:flex; align-items:center; gap:6px; background:var(--encre); color:#fff; border:none;
  padding:10px 16px; border-radius:9px; font-size:13.5px; font-weight:600;
}

.table-fiches{ width:100%; border-collapse:collapse; }
.table-fiches th{
  text-align:left; font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em;
  color:var(--texte-doux); font-weight:600; padding:0 12px 12px; border-bottom:1.4px solid var(--encre);
}
.table-fiches td{ padding:13px 12px; border-bottom:1px solid var(--ligne); font-size:14px; }
.cellule-nom{ font-weight:500; }
.cellule-discrete{ color:var(--texte-doux); }
.cellule-vide{ text-align:center; color:var(--texte-doux); padding:26px; }
.pastille{ font-size:12.5px; font-weight:600; padding:3px 9px; border-radius:20px; }
.pastille-ok{ background:var(--raphia-clair); color:var(--raphia); }
.pastille-attention{ background:var(--terre-clair); color:var(--terre); }

.grille-classes{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.carte-classe{ background:var(--papier-carte); border:1px solid var(--ligne); border-radius:14px; padding:20px; }
.carte-classe-entete{ display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:10px; }
.carte-classe-entete h3{ font-size:16px; font-weight:600; line-height:1.3; }
.carte-classe-effectif{ display:flex; align-items:center; gap:6px; font-size:13px; color:var(--texte-doux); }

.liste-presence{ display:flex; flex-direction:column; }
.ligne-presence{
  display:flex; align-items:center; gap:16px; padding:13px 4px; border-bottom:1px solid var(--ligne);
}
.ligne-presence:last-child{ border-bottom:none; }
.ligne-presence-nom{ font-weight:500; font-size:14px; flex:1; }
.ligne-presence-classe{ font-size:12.5px; color:var(--texte-doux); flex:1; }
.ligne-presence-actions{ display:flex; gap:8px; }
.bouton-statut{
  display:flex; align-items:center; gap:5px; border:1.4px solid var(--ligne); background:#fff;
  padding:6px 12px; border-radius:8px; font-size:12.5px; font-weight:600; color:var(--texte-doux);
  transition:all .15s;
}
.bouton-statut--present{ background:var(--raphia-clair); border-color:var(--raphia); color:var(--raphia); }
.bouton-statut--absent{ background:var(--terre-clair); border-color:var(--terre); color:var(--terre); }
.bouton-statut:disabled{ cursor:default; opacity:0.75; }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 980px){
  .ecran-connexion{ grid-template-columns:1fr; }
  .panneau-gauche{ display:none; }
  .grille-stats{ grid-template-columns:repeat(2,1fr); }
  .grille-double{ grid-template-columns:1fr; }
  .grille-classes{ grid-template-columns:repeat(2,1fr); }

  .bouton-menu-mobile{
    display:flex; align-items:center; justify-content:center; position:fixed; top:16px; left:16px;
    z-index:40; width:38px; height:38px; background:var(--encre); color:#fff; border-radius:9px;
  }
  .barre-laterale{
    position:fixed; left:0; top:0; z-index:50; transform:translateX(-100%); transition:transform .2s;
  }
  .barre-laterale--ouverte{ transform:translateX(0); }
  .bouton-fermer-mobile{ display:flex; }
  .voile-mobile{ display:block; position:fixed; inset:0; background:rgba(27,42,47,0.4); z-index:45; }
  .contenu-principal{ padding:70px 20px 40px; }
}
@media (max-width: 600px){
  .grille-stats{ grid-template-columns:1fr; }
  .grille-classes{ grid-template-columns:1fr; }
  .ligne-presence{ flex-wrap:wrap; }
}
`;
