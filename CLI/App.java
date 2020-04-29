import java.util.*;
import java.io.Console;

public class App{
    static Scanner sc = new Scanner(System.in);
    Database database;

    public static void main(String[] args)
    {
        System.out.println("\nWelcome to Real-Estate Application\n");
        new App().runApplication();
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
            if(ch>=1 && ch<=options.length) break;
            else System.out.println("\nInvalid Choice!!\n");
        }
        return ch;
    }

    // Need to be Upgraded
    public static void getInput(String key,String type,HashMap<String,String> input,int mandatory)
    {
        System.out.print(key+" : ");
        String res = App.sc.nextLine();
        if(!res.equals("")) input.put(key,res);
    }

    public static void print(String val,int size)
    {
        String space = "";
        for(int i=0;i<size-val.length();++i)
            space += " ";
        System.out.print("| "+ val + space);
    }

    public void runApplication()
    {
        database = new Database("project","password");
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

    public static void clear() {
        System.out.print("\033[H\033[2J");  
        System.out.flush();
    }

    public void developers()
    {
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