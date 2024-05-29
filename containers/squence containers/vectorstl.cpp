#include <bits/stdc++.h>
using namespace std;

int main(){
    vector<int> v;
vector<int> a(5,1);
vector<int> last(a);
cout<<"print a"<<endl;

for(int i:last){
    cout<<i<<" ";
}



    cout<<"size->  "<<v.capacity()<<endl;
    v.push_back(1);

    cout<<"size -> "<<v.capacity()<<endl;
     v.push_back(2);

    cout<<"size -> "<<v.capacity()<<endl;
     v.push_back(3);

    cout<<"size -> "<<v.capacity()<<endl; 

    cout<<"capacicty = "<<v.size()<<endl;

    cout<<"before pop"<<endl;
    for(int i:v){
        cout<<i<<"  ";
    }cout<<endl;

    v.pop_back();


     cout<<"after pop"<<endl;
    for(int i:v){
        cout<<i<<"  ";
    }cout<<endl;

    cout<<"before clear size ->"<<v.size()<<endl;
    v.clear();
     cout<<"after clear size ->"<<v.size()<<endl;
        cout<<"size -> "<<v.capacity()<<endl; 


}