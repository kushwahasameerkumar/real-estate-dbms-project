import java.util.*;
import java.io.Console;
import java.util.regex.*;

public class App{
    static Scanner sc = new Scanner(System.in);
    Database database;

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

    // Need to be Upgraded
    public static void getInput(String key,String type,HashMap<String,String> input,int mandatory)
    {
        String txt = key;
        if(type.equals("date")) txt+="(yyyy-mm-dd)";
        if(mandatory==1) txt+="(*)";
        while(true)
        {
            System.out.print(txt+" : ");
            String val = sc.nextLine();
            if(mandatory==0 && val.equals("")) break;
            if(valid(val,type))
            {
                input.put(key,val);
                break;
            }
            System.out.println("\nInvalid input!!\n");
        }
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

    // Hash it
    private String getPassword()
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
}