import java.util.*;
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
            int choice = App.menu(new String[] {"Sales Report","RENT","Show All Properties","Add new Agent","Add new Client","Log-out"});

            switch(choice)
            {
                case 1:
                    salesReport();
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

    private int addPhoneNumber(String userType,String id)
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
            param.put("number",""+phone);
            if(database.addRecord(table,param)>0) res++;
            else System.out.println("\nCouldn't Add Contact\n");
        }
        return 1;
    }

    private int addAgent()
    {
        HashMap<String,String> input = new HashMap<String,String>();    
        App.getInput("agent_id","int",input,1);
        App.getInput("first_name","string",input,1);    
        App.getInput("middle_name","string",input,0);
        App.getInput("last_name","string",input,0);
        App.getInput("street_number","string",input,1);
        App.getInput("street_name","string",input,1);
        App.getInput("city","string",input,1);
        App.getInput("state","string",input,1);
        App.getInput("zip","int",input,0);
        App.getInput("email","email",input,1);
        App.getInput("dob","date",input,0);
        App.getInput("aadhaar_number","int",input,0);
        App.getInput("account_number","string",input,0);
        App.getInput("joining_date","date",input,0);
        App.getInput("salary","int",input,0);
        App.getInput("commission","float",input,0);        

        if(database.addRecord("Agent",input) <= 0) return 0;
        else return addPhoneNumber("agent",input.get("agent_id"));
    }

    private int addClient()
    {    
        HashMap<String,String> input = new HashMap<String,String>();    
        App.getInput("client_id","int",input,1);
        App.getInput("first_name","string",input,1);    
        App.getInput("middle_name","string",input,0);
        App.getInput("last_name","string",input,0);
        App.getInput("street_number","string",input,1);
        App.getInput("street_name","string",input,1);
        App.getInput("city","string",input,1);
        App.getInput("state","string",input,1);
        App.getInput("zip","int",input,0);
        App.getInput("email","email",input,1);
        App.getInput("dob","date",input,0);
        App.getInput("aadhaar_number","int",input,0);

        if(database.addRecord("Client",input) <= 0) return 0;
        else return addPhoneNumber("client",input.get("client_id"));
    }

    private int salesReport()
    {
        HashMap<String,String> input = new HashMap<String,String>();
        App.getInput("agent_id","int",input,1);
        App.getInput("start_date","date",input,1);
        App.getInput("end_date","date",input,1);

        String agent = input.get("agent_id");
        String start = input.get("start_date");
        String end = input.get("end_date");
        return database.viewSalesReport(agent,start,end);
    }

    private int getRentInfo()
    {
        HashMap<String,String> input = new HashMap<String,String>();
        App.getInput("start_date","date",input,1);
        App.getInput("end_date","date",input,1);

        System.out.print("S.no"+"  ");
        System.out.print("Agent_id"+"  ");
        System.out.print("Total_Properties_Given_On_Rent"+" ");
        System.out.print("Total_Amount"+"    ");
        System.out.println("Locations");

        String start = input.get("start_date");
        String end = input.get("end_date");

        return database.viewRentInfo(start,end);
    }
}