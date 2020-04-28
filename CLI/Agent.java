import java.util.*;
import java.sql.*;

public class Agent{
    String agentID;
    Database database;

    public Agent(String _agentID,Database _db)
    {
        agentID = _agentID;
        database = _db;
    }

    public void work()
    {
        System.out.println("\n**Agent**\n");
        boolean signedIn = true;
        do{
            int choice = App.menu(new String[] {"Add new Property","Check Property","My Profile","Log-out"});

            switch(choice)
            {
                case 1:
                    addProperty();
                    break;
                case 2:
                    //checkProperty();
                    break;
                case 3:
                    getProfile();
                    break;
                case 4:
                    signedIn = false;
                    break;
                default:
                    System.out.println("\nInvalid Choice!!\n");
            }
        }while(signedIn);
        System.out.println("\nSigning out...\n");
    }

    private int addProperty()
    {
        HashMap<String,String> input = new HashMap<String,String>();    
        App.getInput("property_id","int",input,1);
        App.getInput("property_name","string",input,1);
        App.getInput("street_number","string",input,1);
        App.getInput("street_name","string",input,1);
        App.getInput("city","string",input,1);
        App.getInput("state","string",input,0);
        App.getInput("zip","int",input,0);
        App.getInput("size","int",input,1);
        App.getInput("no_of_bedroom","int",input,1);
        App.getInput("no_of_bathroom","int",input,1);
        App.getInput("no_of_balcony","int",input,0);
        App.getInput("leisure","string",input,0);
        App.getInput("security","string",input,0);
        App.getInput("description","string",input,0);

        if(database.addRecord("Property",input)<=0) return 0;
        else return putOnSale(input.get("property_id"));    // Deletes property too if failed
    }

    int checkProperty()
    {
        // Category
        System.out.println("\n**Categories**\n");
        int ch = App.menu(new String[]{"For Sale","For Rent"});
        String type = (ch==1? "sale":"rent");

        return 1;
        // furthur filter

        // Query Sql

        // Select property (0: back)

        //return status
    }

    private int putOnSale(String property_id)
    {
        HashMap<String,String> input = new HashMap<String,String>();   
        input.put("property_id",property_id); 
        input.put("agent_id",agentID);
        String category;
        while(true)
        {
            System.out.print("Category(sale,rent) : ");
            category = App.sc.nextLine();
            if(category.equals("sale") || category.equals("rent"))
                break;
            else System.out.println("\nInvalid Choice!!\n");
        }
        input.put("category",category);
        App.getInput("seller_id","",input,1);
        App.getInput("price","int",input,1);
        App.getInput("sale_id","int",input,1);
        App.getInput("date","date",input,1);

        if(database.addRecord("On_Sale",input)>0) return 1;
        else{
            database.delProperty(property_id);  // can be generalised
            return 0;
        }
    }

    private int getProfile()
    {
        if(database.viewRecordById("agent",""+agentID)<=0)
        {
            System.out.println("\nAgent profile couldn't be retrieved!\n");
            return 0;
        }
        // int choice = App.menu(new String[]{"Check Report","Back"});
        // switch(choice)
        // {
        //     case 1:
        //         getSalesReport();
        //         break;
        //     case 2:
        //         System.out.println("\nGoing Back....\n");
        //         break;
        //     default:
        //         System.out.println("\nInvalid Choice!!! Going Back...\n");
        // }
        return 1;
    }
}

//DELETE from TABLE_NAME where X=x and Y=y ...;