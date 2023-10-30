class SearchDisplayActor{
    constructor(adult, name, biography, birthday, deathday, gender, id, imdbID, knownFor, 
        birthPlace, popularity, profilePath) {
            this.adult = adult;
            this.name = name;
            this.biography = biography;
            this.birthday = birthday;
            this.deathday = deathday;
            this.gender = gender;
            this.id = id;
            this.imdbID = imdbID;
            this.knownFor = knownFor;
            this.birthPlace = birthPlace;
            this.popularity = popularity;
            this.profilePath = profilePath;
    } 

    get adult(){
        return this.adult;
    }

    get name(){
        return this.name;
    }

    get biography(){
        return this.biography;
    }

    get birthday(){
        return this.birthday;
    }

    get deathday(){
        return this.deathday;
    }

    get gender(){
        return this.gender;

    }

    get id(){
        return this.id;
    }

    get imdbID(){
        return this.imdbID;
    }

    get knownFor(){
        return this.knownFor
    }

    get birthPlace(){
        return this.birthPlace;
    }

    get popularity(){
        return this.popularity;
    }

    get profilePath(){
        return this.profilePath;
    }
}