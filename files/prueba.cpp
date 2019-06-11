#include <iostream>

#include "anagrames.hpp"


using namespace std;

void mostrar_lista(list<string> l){
	cout<<"[ ";
	for(list<string>::iterator it = l.begin(); it != l.end(); ++it){
		cout<<*it<<" ";
	}
	cout<<"]"<<endl;
}

int main(int argc, char const *argv[])
{

	list<string> l;
	list<string> l_copia;
	anagrames a;/*
	a.insereix("HOLA");
	a.insereix("ALOH");
	a.insereix("SOLA");
	a.insereix("PILA");
	a.insereix("LIPA");
	a.insereix("ALIP");
	a.insereix("CASITA");
	a.insereix("TASICA");
	a.insereix("SICATA");
	a.insereix("TACASI");
	a.mateix_anagrama_canonic("AACIST", l);
	cout<<"origina:\n";
	mostrar_lista(l);
	anagrames b(a);
	b.mateix_anagrama_canonic("AHLO", l_copia);
	cout<<"copia:\n";
	mostrar_lista(l_copia);*/
	a.insereix("A");
	a.insereix("G");
	a.insereix("A");
	a.insereix("C");
	a.insereix("D");
	a.insereix("E");
	return 0;
}