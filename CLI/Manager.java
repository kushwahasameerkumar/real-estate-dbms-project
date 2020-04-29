import java.util.*;
import java.util.regex.*;
import java.sql.*;

public class Manager{
    String user;
    Database database;

    public Manager(String _user,Database _db)
    {
        user = _user;
        database = _db;
    }

    public void work()
    {
        System.out.println("\n**Real-Estate Office**\n");
        boolean signedIn = true;
        do{
            int choice = App.menu(new String[] {"Get Sales Report","Get Rent Data","Show All Properties","Add new Agent","Add new Client","Log-out"});

            switch(choice)
            {
                case 1:
                    getSalesReport();
                    break;
                case 2:
                    getRentInfo();
                    break;
                case 3:
                    //showAllProperties();
                    break;
                case 4:
                    addAgent();
                    break;
                case 5:
                    addClient();
                    break;
                case 6:
                    signedIn = false;
                    break;
                default:
                    System.out.println("\nInvalid Choice!!\n");
            }
        }while(signedIn);
        System.out.println("\nSigning out...\n");
    }

    private void addPhoneNumber(String userType,String id)
    {
        System.out.print("Number of phone number to add? ");
        int cnt = App.sc.nextInt(); App.sc.nextLine();
        int res = 0;
        String table = userType+"_Phone_Detail";
        HashMap<String,String> param = new HashMap<String,String>();
        param.put(userType+"_id",id);
        
        while(--cnt >=0)
        {
            System.out.print("Phone Number "+(res+1)+" : ");
            String phone = App.sc.nextLine();   // num verify
            if(phone.length()==10 && Pattern.matches("[0-9]{10}",phone))
            {
                param.put("number",""+phone);
                if(database.addRecord(table,param)>0) res++;
                else System.out.println("\nCouldn't Add Contact\n");
            }
            else System.out.println("\nInvalid Number!!\n");
        }
        App.clear();
        System.out.println("\n"+res+" Contact(s) Added Successfully!!\n");
    }

    private void addAgent()
    {
        HashMap<String,String> input = new HashMap<String,String>();    
        App.getInput("agent_id","int",input,1);
        App.getInput("first_name","string",input,1);    
        App.getInput("middle_name","string",input,0);
        App.getInput("last_name","string",input,0);
        App.getInput("street_number","string",input,0);
        App.getInput("street_name","string",input,0);
        App.getInput("city","string",input,0);
        App.getInput("state","string",input,0);
        App.getInput("zip","int",input,0);
        App.getInput("email","email",input,1);
        App.getInput("dob","date",input,0);
        App.getInput("aadhaar_number","int",input,0);
        App.getInput("account_number","string",input,0);
        App.getInput("joining_date","date",input,0);
        App.getInput("salary","int",input,0);
        App.getInput("commission","float",input,0);      
        App.clear();
        int res = database.addRecord("Agent",input);
        if(res<0) System.out.println("\nInvalid Argument(s) passed!!!\n");
        else if(res==0) System.out.println("\nAgent couldn't be Added! Try again later...\n");
        else{
            System.out.println("\nAgent Added Successfully!\n");
            addPhoneNumber("agent",input.get("agent_id"));
        }
    }

    private void addClient()
    {    
        HashMap<String,String> input = new HashMap<String,String>();    
        App.getInput("client_id","int",input,1);
        App.getInput("first_name","string",input,1);    
        App.getInput("middle_name","string",input,0);
        App.getInput("last_name","string",input,0);
        App.getInput("street_number","string",input,0);
        App.getInput("street_name","string",input,0);
        App.getInput("city","string",input,0);
        App.getInput("state","string",input,0);
        App.getInput("zip","int",input,0);
        App.getInput("email","email",input,1);
        App.getInput("dob","date",input,0);
        App.getInput("aadhaar_number","int",input,0);
        App.clear();
        int res = database.addRecord("Client",input);
        if(res<0) System.out.println("\nInvalid Argument(s) passed!!!\n");
        else if(res==0) System.out.println("\nClient couldn't be Added! Try again later...\n");
        else{
            System.out.println("\nClient Added Successfully!\n");
            addPhoneNumber("client",input.get("client_id"));
        }
    }

    private void getSalesReport()
    {
        HashMap<String,String> input = new HashMap<String,String>();
        App.getInput("agent_id","int",input,1);
        App.getInput("start_date","date",input,1);
        App.getInput("end_date","date",input,1);

        String agent = input.get("agent_id");
        String start = input.get("start_date");
        String end = input.get("end_date");

        int res = database.viewSalesReport(agent,start,end);
        if(res<0) System.out.println("\nInvalid parameter passed! Try again Later...\n");
        else if(res==0) System.out.println("\nNo record found!\n");
    }

    private void getRentInfo()
    {
        HashMap<String,String> input = new HashMap<String,String>();
        App.getInput("start_date","date",input,1);
        App.getInput("end_date","date",input,1);

        System.out.println("\n");
        App.print("S.no",6);
        App.print("Agent_id",10);
        App.print("Total_Properties_Given_On_Rent",31);
        App.print("Total_Amount",15);
        App.print("Locations",0);
        System.out.println();

        String start = input.get("start_date");
        String end = input.get("end_date");

        int res = database.viewRentInfo(start,end);
        if(res<0) System.out.println("\nInvalid parameter passed! Try again Later...\n");
        else if(res==0) System.out.println("\nNo record found!\n");
    }
}