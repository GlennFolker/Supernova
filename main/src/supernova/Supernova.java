package supernova;

import arc.*;
import net.dv8tion.jda.api.*;
import net.dv8tion.jda.api.entities.*;

import static mindustry.Vars.*;

public class Supernova{
    static JDA jda;
    static Guild guild;
    public static final Messages messages = new Messages();
    public static final Commands commands = new Commands();

    public static void main(String[] args){
        new Supernova();
    }

    public Supernova(){
        setup();

        try{
            init();
        }catch(Exception e){
            throw new RuntimeException(e);
        }

        jda.shutdown();
        System.exit(0);
    }

    void setup(){
        headless = true;
        loadLogger();

        Core.settings = new Settings();
        Core.net = new Net();

        Core.settings.setAppName("Supernova");
        Core.settings.put("guild-id", 715164441137643521L);
    }

    void init() throws Exception{
        String token = System.getenv("SUPERNOVA_TOKEN");
        if(token == null){
            throw new IllegalArgumentException("token is null");
        }

        jda = new JDABuilder(token).build();
        jda.awaitReady();
        jda.addEventListener(messages);

        guild = jda.getGuildById(Core.settings.getLong("guild-id"));
    }
}
