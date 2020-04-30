import java.util.*;
import java.io.Console;
import java.util.regex.*;

public class App{
    static Scanner sc = new Scanner(System.in);
    Database database;
    static String defPassword = "0000";

    public static void main(String[] args)
    {
        System.out.println("\nWelcome to Real-Estate Application\n");
        new App().runApplication(args.length>0);
    }

    public static int menu(String[] options)
    {
        int ch;
        while(true)
        {
            System.out.println();
            System.out.println("------------------");
            System.out.println("    OPTIONS    ");
            System.out.println("------------------");
            for(int i=0;i<options.length;++i)
            {
                System.out.println((i+1)+". "+options[i]);
            }
            System.out.print("Enter your choice : ");
            ch = sc.nextInt(); sc.nextLine();
            clear();
            if(ch>=1 && ch<=options.length) break;
            else System.out.println("\nInvalid Choice!!\n");
        }
        return ch;
    }

    public static String getInput(String key,String type,HashMap<String,String> input,int mandatory)
    {
        String val,txt = key;
        if(type.equals("date")) txt+="(yyyy-mm-dd)";
        if(mandatory==1) txt+="(*)";
        while(true)
        {
            System.out.print(txt+" : ");
            val = sc.nextLine();
            if(mandatory==0 && val.equals("")) break;
            if(valid(val,type))
            {
                input.put(key,val);
                break;
            }
            System.out.println("\nInvalid input!!\n");
        }
        return val;
    }

    public static boolean valid(String val,String type)
    {
        String conditon = ".+";
        if(type.equals("int"))
        {
            conditon = "[0-9]+";
        }
        if(type.equals("float"))
        {
            conditon = "[0-9]+\\.[0-9]+";
        }
        if(type.equals("date"))
        {
            conditon = "[12][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]";
        }
        if(type.equals("email"))
        {
            conditon = "[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z]+";
        }
        return Pattern.matches(conditon,val);
    }

    public static void print(String val,int size)
    {
        if(val==null) val = "";
        String space = "";
        for(int i=0;i<size-val.length();++i)
            space += " ";
        System.out.print("| "+ val + space);
    }

    public void runApplication(boolean flag)
    {
        database = new Database("project","password",flag);
        boolean run = true;

        while(run)
        {
            int choice = menu(new String[] {"Login Page","Exit"});
            switch(choice)
            {
                case 1:
                    login();
                    break;
                case 2:
                    try{
                        database.close();
                    }catch(Exception e) {}
                    run = false;
                    break;
                default:
                    System.out.println("Invalid Choice!!\n");
            }
        }
        developers();
    }

    public void login()
    {
        String user,pwd;
        System.out.println("\n***LOGIN PAGE***\n");
        System.out.print("UserID : ");
        user = sc.nextLine();
        System.out.print("Password : ");
        pwd = getPassword();
        clear();
        switch(database.verify(user,pwd))
        {
            case 1:
                new Manager(user,database).work();
                break;
            case 2:
                new Agent(user,database).work();
                break;
            default:
                System.out.println("Invalid credentials!\n");
        }
    }

    public static String getPassword()
    {
        String pwd = "";
        try{
            Console console = System.console();
            if(console==null)
            {
                pwd = sc.nextLine();
            }
            else{
                char[] pass = console.readPassword();
                pwd = new String(pass);
            }
        }
        catch(Exception e){}

        return pwd;
    }

    public static void clear() 
    {
        try{
            new ProcessBuilder("cmd", "/c", "cls").inheritIO().start().waitFor();
        }
        catch(Exception e){
            System.out.print("\033[H\033[2J");  
            System.out.flush();
        }
    }

    public void developers()
    {
        clear();
        System.out.print("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        System.out.println("\nDeveloped By: \n");
        String dev[] = {"Nimish Agrawal(Me)","Sameer Kushwaha","Sayan Kar","Raj Ranjan"};
        int roll[] = {1801113,1801151,1801162,1801136};

        for(int i=0;i<4;++i)
        {
            String student = String.format("%d. %s - %d",i+1,dev[i],roll[i]);
            System.out.println(student);
        }
        System.out.print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        System.out.println("\n\nExiting...");
    }

    public static String commonFilter()
    {
        String filter = " ";
        //Category
        System.out.println("Category? ");
        int choice = App.menu(new String[]{"Sale","Rent","Both"});
        if(choice==1) filter += " and category='sale'";
        else if(choice==2) filter += " and category='rent'";

        // Price
        System.out.print("Price(lower bound) ? ");
        String price = App.sc.nextLine();
        if(valid(price,"int")) filter += " and price>="+price;
        else System.out.println("\nLower price not set!\n");

        System.out.print("Price(upper bound) ? ");
        price = App.sc.nextLine();
        if(valid(price,"int")) filter += " and price<="+price;
        else System.out.println("\nUpper price not set!\n");

        // Size
        System.out.print("Size(lower bound) ? ");
        String size = App.sc.nextLine();
        if(valid(size,"int")) filter += " and size>="+size;
        else System.out.println("\nLower bound not set!\n");

        System.out.print("Size(upper bound) ? ");
        size = App.sc.nextLine();
        if(valid(size,"int")) filter += " and size<="+size;
        else System.out.println("\nUpper bound not set!\n");


        // #Bedroom
        System.out.print("Number of Bedrooms(lower bound) ? ");
        String bed = App.sc.nextLine();
        if(valid(bed,"int")) filter += " and no_of_bedroom>="+bed;
        else System.out.println("\nLower bound not set!\n");

        System.out.print("Number of Bedrooms(upper bound) ? ");
        bed = App.sc.nextLine();
        if(valid(bed,"int")) filter += " and no_of_bedroom<="+bed;
        else System.out.println("\nUpper bound not set!\n");

        // #Bathroom
        System.out.print("Number of Bathrooms(lower bound) ? ");
        String bath = App.sc.nextLine();
        if(valid(bath,"int")) filter += " and no_of_bathroom>="+bath;
        else System.out.println("\nLower bound not set!\n");

        System.out.print("Number of Bathrooms(upper bound) ? ");
        bath = App.sc.nextLine();
        if(valid(bath,"int")) filter += " and no_of_bathroom<="+bath;
        else System.out.println("\nUpper bound not set!\n");

        // Location
        System.out.print("Enter Area to search ? ");
        String area = App.sc.nextLine();    // SqlInjection
        if(!Pattern.matches("[ ]*",area))
        {
            filter += " and street_name like '%"+area+"%' ";
        }
        return filter;
    }
}