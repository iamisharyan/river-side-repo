#include <bits/stdc++.h>
using namespace std;

int main(){
    set<int> s;

 s.insert(5);
 s.insert(1);
  s.insert(6);
   s.insert(0);
for(auto i:s){
    cout<<i<<endl;
}
cout<<"after erase -->"<<endl;
set<int>::iterator it = s.begin();
it++;
s.erase(it);
for(auto i:s){
    cout<<i<<endl;
}
cout<<endl;
cout<<"element present or not-- >"<<" ";
cout<<s.count(5)<<endl;




set<int>::iterator itr = s.find(5);

for(auto it=itr; it!=s.end();it++){
cout<<*it<<" ";
}
cout<<endl;

}