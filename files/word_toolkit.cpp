#include "word_toolkit.hpp"
#include <algorithm>

#define NUM_LLETRES 26
#define LLETRA_EXCLUIDA -1


/******************************MÈTODES PÚBLICS*********************************/

//Cost: 0(n)
/* Retorna cert si i només si les lletres de l'string s estan en 
 ordre lexicogràfic ascendent. */
bool word_toolkit::es_canonic(const string& s) throw(){
	bool ordenat = true;
	unsigned int i = 0;
	while(ordenat and i+1 < s.size()){
		if(s[i] > s[i+1]){
			ordenat = false;
		}
		i++;
	}
  	return ordenat;
}

//Cost:  O(n*log2(n)) --> extret de cppreference
/* Retorna l'anagrama canònic de l'string s. 
 Veure la classe anagrames per saber la definició d'anagrama canònic. */
string word_toolkit::anagrama_canonic(const string& s) throw(){
	string aux = s;
	if(not es_canonic(aux)){
		sort(aux.begin(), aux.end());
	}
	return aux;
}


/****************************MÈTODES PRIVATS*********************************/
//Cost(1)
/* 	Metode que indica si EXCL conté totes les lletres, 
	un cop s'han indicat en l'array del pi.*/
bool totes_les_lletres_excluides(int lletres[]){
	bool totes_excluides = true;
	int i = 0;
	while(totes_excluides and i < NUM_LLETRES){
		if(lletres[i] != LLETRA_EXCLUIDA){
			totes_excluides = false;
		}
		i++;
	}
	return totes_excluides;
}

/***************************FI MÈTODES PRIVATS********************************/

//Cost: 0(n)
/* Retorna el caràcter que no apareix a l'string excl i és el més
 freqüent en la llista de paraules L, sent L una llista no buida
 de paraules formades exclusivament amb lletres majúscules de
 la 'A' a la 'Z' (excloses la 'Ñ', 'Ç', majúscules accentuades, ...).
 En cas d'empat, es retornaria el caràcter alfabèticament menor.
 Si l'string excl inclou totes les lletres de la 'A' a la 'Z' es 
 retorna el caràcter '\0', és a dir, el caràcter de codi ASCII 0. */
char word_toolkit::mes_frequent(const string& excl, const list<string>& L) throw(){
	int frequencia[NUM_LLETRES] = {}; //Inicialitza a 0 totes les posicions
	char lletra_sortida = '\0';

	//Seleccionem les lletres com excluides
	for(unsigned int i = 0; i < excl.size(); ++i){
		int lletra = (int)excl[i]-65;
		frequencia[lletra] = LLETRA_EXCLUIDA;
	}

	//Si l'string excl no conte totes les lletres entrem.
	if(not totes_les_lletres_excluides(frequencia)){
		string paraula;

		//Incrementem el valor de les frequencies a partir de les paraules de la llista L
		for (list<string>::const_iterator it=L.begin(); it != L.end(); ++it){
			paraula = *it;
			int lletra;
			for(unsigned int i=0; i < paraula.size(); ++i){
				lletra = (int)paraula[i]-65;
				if(frequencia[lletra] != LLETRA_EXCLUIDA){
					frequencia[lletra] += 1;
				}
			}
		}

		//busquem en la llista de frequencies la lletra que ha aparegut més cops.
		int max_repeticions = 0;
		for(unsigned int i = 0; i < NUM_LLETRES; ++i){
			if(frequencia[i] > max_repeticions){
				max_repeticions = frequencia[i];
				lletra_sortida = (char)(i+65);
			}
		}
	}

	return lletra_sortida;

}

/***************************FI MÈTODES PÚBLICS*********************************/


/*
************************DOCUMENTACIÓ DE LA CLASSE WORD_TOOLKIT************************

- ESTRUCTURA DE DADES I VARIABLES EMPRADES -

La classe word_toolkit consta de tres metodes:
	
	- es_canonic():
		Mirem si l'string esta en ordre ascendent lletra per lletra, altre alternativa hagues sigut, ordenar l'string amb el métode sort y compararlo amb el de la entrada, pero el cost pasaría de n a n*log2(n).
	
	- anagrama_canonic():
		Mirem si l'string esta ja ordenat y si no esta cridem al metode sort de la stl per a ordenar-lo
	
	- mes_frequent():
		En aquest cas, tenim utilitzarem un array d'enters on casa posició es una lletra, desde la 'A' (posició 0) fins la 'Z' (posició 25).
		Inicialmente ficarem a -1 les posicions de les lletres de l'string de lletres excluides. Un cop les tenim.
		Comprovem que no són totes les lletres de l'abecedari.
		Ara començem a incrementar el valor de la posició de la lletra a partir de totes les lletres de les paraules de la llista d'entrada.
		Finalment busquem en l'array la lletra que ha aparegut més cops.
*/