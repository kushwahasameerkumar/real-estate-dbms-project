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
            int choice = App.menu(new String[] {"Add new Property","Check Property on Sale","My Profile","Log-out"});

            switch(choice)
            {
                case 1:
                    addProperty();
                    break;
                case 2:
                    checkProperty();
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

    private void addProperty()
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
        App.clear();
        String property_id = input.get("property_id");
        int res = database.addRecord("Property",input);
        if(res<0) System.out.println("\nInvalid Argument(s) passed!!!\n");
        else if(res==0) System.out.println("\nProperty couldn't be Added! Try again later...\n");
        else if(putOnSale(property_id)>0){
            System.out.println("\nProperty successfully Added to Sale\n");
        }
        else if(database.delRecord("Property","property_id",property_id)>0){
            System.out.println("Property couldn't be posted on Sale\n");
        }
        else System.out.println("\nProperty Saved in database but cannot be put on Sale\n");
    }

    private void checkProperty()
    {
        String filter = getFilter();
        Vector<String> sale_ids = database.viewPropertiesOnSale(filter);
        
        System.out.print("Enter S.no to view(0 to go back) : ");
        int sno = App.sc.nextInt(); App.sc.nextLine();
        if(sno<=0 || sno>sale_ids.size())
        {
            if(sno!=0) System.out.print("\nInvalid Choice!! ");
            System.out.println("Going back...\n");
            return;
        }
        App.clear();
        HashMap<String,String> saleData = database.viewPropertyInDetail(sale_ids.get(sno-1));
        int choice = App.menu(new String[]{"Make Deal","Delete Sale","Go Back"});
        switch(choice)
        {
            case 1:
                makeDeal(saleData);
                break;
            case 2:
                deleteSale(sale_ids.get(sno-1));
                break;
            case 3:
                System.out.println("\nGoing Back...");
                break;
            default:
                System.out.println("\nInvalid Choice!! Going Back...\n");
        }
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
        App.clear();
        return database.addRecord("On_Sale",input);
    }

    private int makeDeal(HashMap<String,String> saleData)
    {
        HashMap<String,String> TxData = new HashMap<String,String>();
        App.getInput("transaction_id","int",TxData,1);
        App.getInput("buyer_id","int",TxData,1);
        App.getInput("final_price","int",TxData,1);
        App.getInput("date_of_sale","date",TxData,1);
        App.clear();
        // Construct TxData
        TxData.put("agent_id",""+agentID);
        TxData.put("seller_id", saleData.get("seller_id"));
        TxData.put("property_id", saleData.get("property_id"));
        TxData.put("category", saleData.get("category"));
        TxData.put("date_put_on_sale", saleData.get("date"));

        String sale_id = saleData.get("sale_id");
        if(database.delRecord("On_Sale","sale_id",sale_id)>0)
        {
            if(database.addRecord("Transaction",TxData)>0)
            {
                System.out.println("\nTransaction is successfull!!!\n");
                return 1; // Success
            }
            else{
                if(database.addRecord("On_Sale",saleData)>0)
                {
                    System.out.println("Deal cancelled! Parameter were invalid!!! ....\n");
                    return 0; // Fail
                }
                else{
                    System.out.println("\nFatal Error : Tx Failed, Property removed from OnSale record!!!\n");
                    return -1;  // Fatal error
                }
            }
        }
        else{
            System.out.println("Deal couldn't be initiated! Try Later....\n");
            return 0;   // Fail
        }
    }

    private void deleteSale(String sale_id)
    {
        int res = database.delRecord("On_Sale","sale_id",sale_id);
        if(res>0) System.out.println("\nSuccessfully deleted from OnSale Record!\n");
        else if(res<=0) System.out.println(String.format("Sale Id %s not found!!\n",sale_id));
    }

    private void getProfile()
    {
        int res = database.viewRecordById("agent",""+agentID);
        if(res==0) System.out.println("\nAgent profile couldn't be retrieved!\n");
        else if(res<0) System.out.println("\nAgent profile doesn't exists!\n");
        // else
        // {
        //     int choice = App.menu(new String[]{"Check Report","Back"});
        //     switch(choice)
        //     {
        //         case 1:
        //             getSalesReport();
        //             break;
        //         case 2:
        //             System.out.println("\nGoing Back....\n");
        //             break;
        //         default:
        //             System.out.println("\nInvalid Choice!!! Going Back...\n");
        //     }
        // }
    }

    private String getFilter()
    {
        return "agent_id = "+agentID;
    }
}