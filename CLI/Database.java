import java.util.*;
import java.sql.*;

public class Database{
    Connection connect;
    Statement statement;

    public Database(String dbName,String pwd)
    {
        String db = "jdbc:mysql://localhost:3306/"+dbName;
        try{        	
            connect = DriverManager.getConnection(db,"root",pwd);
            statement = connect.createStatement();
        } catch(Exception e)
        {
            System.out.println("Cannot connect to database!!!");
            System.exit(1);
        }
    }

    public int verify(String user,String pwd)
    {
        String cmd = "SELECT type FROM userauth WHERE userid = ? AND password = ?";
        try{
            PreparedStatement auth = connect.prepareStatement(cmd);
            auth.setString(1,user);
            auth.setString(2,pwd);
            ResultSet output = auth.executeQuery();

            while(output.next())
            {
                String type = output.getString("type");
                if(type.equals("manager")) return 1;
                else return 2;
            }
        }catch(Exception e){ e.printStackTrace();}
        
        return 0;
    }

    public int addRecord(String table, HashMap<String,String> input)
    {
        int cnt = 0;
        String param1 = "";
        String param2 = "";
        for(String key : input.keySet())
        {
            if(cnt>0){
                param1 += ",";
                param2 += ",";
            }
            param1 += key;
            param2 += "?";
            ++cnt;
        }
        String txt = String.format("INSERT into %s values(%s)",table+"(%s)","%s");
        String cmd = String.format(txt,param1,param2);

        int res = 0;
        try{
            PreparedStatement addStmt = connect.prepareStatement(cmd);
            int i = 1;
            for(String k : input.keySet())
            {
                addStmt.setString(i++,input.get(k));
            }
            res = addStmt.executeUpdate();
            addStmt.close();
        }catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
        return res;
    }

    public int delRecord(String table,String PK,String id)
    {
        int res=0;
        String cmd = String.format("DELETE from %s WHERE %s = ?",table,PK);
        try{
            PreparedStatement delStmt = connect.prepareStatement(cmd);
            delStmt.setString(1,id);
            res = delStmt.executeUpdate();
            delStmt.close();
        }
        catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
        return res;
    }

    // Single Record
    public int viewRecordById(String table,String id)
    {
        String cmd = String.format("SELECT * from %s where %s = ?",table,table+"_id");
        try{
            PreparedStatement viewStmt = connect.prepareStatement(cmd);
            viewStmt.setString(1,id);
            ResultSet record = viewStmt.executeQuery();
            ResultSetMetaData meta = record.getMetaData();
            int totCol = meta.getColumnCount();
            System.out.println();
            while(record.next())
            {
                for(int i=1;i<=totCol;++i)
                {
                    String colName = meta.getColumnLabel(i);
                    String val = record.getString(colName);
                    if(!record.wasNull())
                    {
                        System.out.println(colName + " : " + val);
                    }
                }
            }
        }
        catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
        return 1;
    }

    // Multiple Record
    public int viewSalesReport(String agent_id,String start,String end)
    {
        String s1 = "SELECT Transaction_id,property_id,buyer_id,seller_id,final_price,date_of_sale FROM Transaction ";
        String s2 = "WHERE agent_id = ? AND category='sale' AND date_of_sale between ? and ?";
        String cmd = s1+s2;
        int res = 0;
        try{
            PreparedStatement viewStmt = connect.prepareStatement(cmd);
            viewStmt.setString(1,agent_id);
            viewStmt.setString(2,start);
            viewStmt.setString(3,end);
            ResultSet record = viewStmt.executeQuery();
            ResultSetMetaData meta = record.getMetaData();
            int totCol = meta.getColumnCount();
            while(record.next())
            {
                if(res==0)  // Print columns
                {
                    System.out.println();
                    App.print("S.No",6);
                    for(int i=1;i<=totCol;++i)
                    {
                        String colName = meta.getColumnLabel(i);
                        App.print(colName,15);
                    }
                    System.out.println();
                }
                // print row
                ++res;
                App.print(""+res,6);
                for(int i=1;i<=totCol;++i)
                {
                    String val = record.getString(i);
                    App.print(val,15);
                }
                System.out.println();                
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return -1;
        }
        return res;
    }

    public int viewRentInfo(String start,String end)
    {
        int res=0;
        try{
            ResultSet record = statement.executeQuery("SELECT agent_id from Agent");
            while(record.next())
            {
                String agent_id = record.getString(1);
                viewRentInfoAgent(agent_id,start,end,res+1);
                res++;
            }
        }
        catch(Exception e){
            e.printStackTrace(); // for testing purpose
            return -1;
        }
        System.out.println();
        return res;
    }

    public void viewRentInfoAgent(String agent_id,String start,String end,int sno) throws SQLException
    {
        String s1 = "SELECT property_id,street_name,final_price from Property NATURAL JOIN Transaction ";
        String s2 = "WHERE category='rent' AND agent_id = ? AND date_of_sale between ? and ?";
        String cmd = String.format(s1+s2,agent_id,start,end);

        PreparedStatement viewTx = connect.prepareStatement(cmd);
        viewTx.setString(1,agent_id);
        viewTx.setString(2,start);
        viewTx.setString(3,end);
        ResultSet record = viewTx.executeQuery();

        int totProperty = 0;
        long totAmt = 0;
        Set<String> loc = new TreeSet<String>();

        while(record.next())
        {
            totProperty++;
            totAmt += Long.parseLong(record.getString("final_price"));
            loc.add(record.getString("street_name"));
        }
        App.print(""+sno,6);
        App.print(agent_id,10);
        App.print(""+totProperty,31);
        App.print(""+totAmt,15);
        App.print(loc.toString(),0);
        System.out.println();
    }

    // Returns vector of sale_id displayed on sale
    public Vector<String> viewPropertiesOnSale(String filter)
    {
        String rows = "sale_id,property_id,property_name,street_number,street_name,category,size,price,no_of_bedroom,no_of_bathroom";
        String cmd = String.format("SELECT %s from Property NATURAL JOIN On_Sale where %s",rows,filter);
        Vector<String> sale_ids = new Vector<String>();
        int res=0;
        try{
            ResultSet record = statement.executeQuery(cmd);
            ResultSetMetaData meta = record.getMetaData();
            int totCol = meta.getColumnCount();
            while(record.next())
            {
                sale_ids.add(record.getString(1));
                if(res==0)  // Print columns
                {
                    System.out.println();
                    App.print("S.No",6);
                    for(int i=1;i<=totCol;++i)
                    {
                        String colName = meta.getColumnLabel(i);
                        App.print(colName,15);
                    }
                    System.out.println();
                }
                // print row
                ++res;
                App.print(""+res,6);
                for(int i=1;i<=totCol;++i)
                {
                    String val = record.getString(i);
                    App.print(val,15);
                }
                System.out.println();                
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
        if(res==0) System.out.println("\nNo matching property(s) found!!!\n");
        return sale_ids;
    }

    // Returns record of the given sale_id {colName : value}
    public HashMap<String,String> viewPropertyInDetail(String sale_id)
    {
        HashMap<String,String> data = new HashMap<String,String>();
        String cmd = "SELECT * from On_Sale where sale_id = ?";
        try{
            PreparedStatement viewProp = connect.prepareStatement(cmd);
            viewProp.setString(1,sale_id);
            ResultSet record = viewProp.executeQuery();
            ResultSetMetaData meta = record.getMetaData();
            int totCol = meta.getColumnCount();
            while(record.next())
            {
                System.out.println();
                String property_id = record.getString("property_id");
                viewRecordById("Property",property_id); // use return value?
                for(int i=1;i<=totCol;++i)
                {
                    String colName = meta.getColumnLabel(i);
                    String val = record.getString(colName);
                    data.put(colName,val);
                    if(!colName.equals("property_id") && !record.wasNull())
                    {
                        System.out.println(colName + " : " + val);
                    }
                }
            }
        }catch(Exception e){ e.printStackTrace();}
        return data;
    }

    public void close() throws SQLException
    {
        statement.close();
        connect.close();
    }
}