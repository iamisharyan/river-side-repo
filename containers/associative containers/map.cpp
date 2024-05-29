#include <bits/stdc++.h>
using namespace std;

int main(){
    map<int,string> m;
m[1] ="ayush";
m[13] ="mishra";
m[2] ="aryan";

m.insert({ 5, "bheem"});
cout<<"before erase --> "<<endl;

for(auto i:m){
    cout<<i.first<<" "<<i.second<<" "<<endl;
}


cout<<"finding 13  = "<<m.count(13);
cout<<endl;
m.erase(13);

cout<<"after erase --> "<<endl;
for(auto i:m){
    cout<<i.first<<" "<<i.second<<" "<<endl;
}

auto it = m.find(5);
for(auto i=it; i!=m.end(); i++){
cout<<(*i).first<<endl;
}



}