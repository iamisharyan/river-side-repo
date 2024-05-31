#include<bits/stdc++.h>
using namespace std;

int main() {
    multimap<int, int> g1;

     g1.insert(pair<int ,int>(1,40));
      g1.insert(pair<int ,int>(2,30));
       g1.insert(pair<int ,int>(3,60));
        g1.insert(pair<int ,int>(6,50));
         g1.insert(pair<int ,int>(6,10));

         multimap<int, int>::iterator itr;
         cout<<"The Multimap g1 is :";cout<<endl;
         cout<<"\tKEY\tELEMENTS\n"; 
         for(itr =g1.begin(); itr!= g1.end(); ++itr){
            cout<<'\t' << itr->first <<'\t' << itr->second<<'\n';

         }
cout<<endl;
 // adding elements randomly,
    // to check the sorted keys property
g1.insert(pair<int, int>(4,50));
g1.insert(pair<int ,int>(5,10));
 cout<<"The Multimap after adding elements in g1 is :";cout<<endl;
         cout<<"\tKEY\tELEMENTS\n"; 
         for(itr =g1.begin(); itr!= g1.end(); ++itr){
            cout<<'\t' << itr->first <<'\t' << itr->second<<'\n';

         }
cout<<endl;
  // assigning the elements from g1 to g2
multimap<int ,int> g2(g1.begin() , g1.end());
  cout<<"assigning the elements from g1 to g2 :";cout<<endl;
         cout<<"\tKEY\tELEMENTS\n"; 
         for(itr =g2.begin(); itr!= g2.end(); ++itr){
            cout<<'\t' << itr->first <<'\t' << itr->second<<'\n';

         }
cout<<endl;
 // remove all elements up to
    // key with value 3 in gquiz2
    cout<< "g2 after removal of key elements less than 3 : \n";
     cout<<"\tKEY\tELEMENTS\n"; 
     g2.erase(g2.begin(),g2.find(3));
      for(itr =g2.begin(); itr!= g2.end(); ++itr){
            cout<<'\t' << itr->first <<'\t' << itr->second<<'\n';

         }
cout<<endl;
  // remove all elements with key = 4
  int num;
  num = g2.erase(4);
  cout<<"g2.erase(4) \n";
  cout<< num <<" removed \n";
    cout<<"\tKEY\tELEMENTS\n"; 
     for(itr =g2.begin(); itr!= g2.end(); ++itr){
            cout<<'\t' << itr->first <<'\t' << itr->second<<'\n';

         }
cout<<endl;
  // lower bound and upper bound for multimap gquiz1 key =
    // 5
  cout << "gquiz1.lower_bound(5) : "<<endl;
      cout  << "\tKEY = ";
    cout << g1.lower_bound(5)->first << '\t';
    cout << "\tELEMENT = " << g1.lower_bound(5)->second
       << endl;
    cout << "gquiz1.upper_bound(5) : "<<endl;
     cout<< "\tKEY = ";
    cout << g1.upper_bound(5)->first << '\t';
    cout << "\tELEMENT = " << g1.upper_bound(5)->second
         << endl;

    return 0;
}