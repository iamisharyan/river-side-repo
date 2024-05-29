#include <bits/stdc++.h>
using namespace std;

int main(){
    deque<int> d;
    d.push_back(1);
d.push_front(2);

for(int i:d){
    cout<<i<<" ";
}
// d.pop_back();
// cout<<endl;
// for(int i:d){
//     cout<<i<<endl;
//}
cout<<endl;
cout<<"print first index element -->"<<d.at(1)<<endl;

cout<<"front -->"<<d.front();

cout<<endl;
cout<<"back  -->"<<d.back();

cout<<endl;
cout<<"empty or not ->>"<<d.empty();

cout<<endl;
cout<<"before erase --> "<<d.size();

cout<<endl;
d.erase(d.begin(),d.begin()+1);
// d.erase(d.end(),d.end()+1);
cout<<"after erase --> "<<d.size();




}
